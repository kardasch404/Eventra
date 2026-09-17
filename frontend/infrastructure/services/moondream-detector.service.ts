export interface SolverConfig {
  maxAttempts: number;
  waitAfterClick: number;
  waitAfterVerify: number;
  useAudio: boolean;
  useMoondream: boolean;
  moondreamModel: string;
  ollamaUrl: string;
}

export const DEFAULT_SOLVER_CONFIG: SolverConfig = {
  maxAttempts: 3,
  waitAfterClick: 1,
  waitAfterVerify: 5,
  useAudio: false,
  useMoondream: true,
  moondreamModel: 'llava-phi3',
  ollamaUrl: 'http://localhost:11434',
};

interface OllamaResponse {
  response?: string;
  done_reason?: string;
  [key: string]: unknown;
}

interface GridSolution {
  cells?: number[];
  [key: string]: unknown;
}

export class MoondreamDetector {
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(config: SolverConfig = DEFAULT_SOLVER_CONFIG) {
    this.model = config.moondreamModel;
    this.baseUrl = config.ollamaUrl;
  }

  private buildGridPrompt(targetObject: string, gridSize: number): string {
    let gridLayout: string;
    let maxCells: number;
    let gridLabel: string;

    if (gridSize === 16) {
      gridLayout = '[0][1][2][3]\n[4][5][6][7]\n[8][9][10][11]\n[12][13][14][15]';
      maxCells = 7;
      gridLabel = '4x4';
    } else {
      gridLayout = '[0][1][2]\n[3][4][5]\n[6][7][8]';
      maxCells = 5;
      gridLabel = '3x3';
    }

    return `You are solving a reCAPTCHA image grid challenge.

TASK: Select tiles containing ${targetObject.toUpperCase()}.

You are given the FULL challenge screenshot: instruction area + numbered ${gridLabel} image grid.

Grid numbering:
${gridLayout}

Rules:
1) Select only tiles that clearly contain the target object.
2) If uncertain, do not select.
3) Return valid JSON only, with no markdown and no extra text.
4) Output schema exactly: {"cells":[int,int,...]}
5) Keep output short. Maximum ${maxCells} cells.

Example valid output:
{"cells":[0,4]}`;
  }

  private async callOllamaJson(
    prompt: string,
    imgBase64: string,
    numPredict: number,
  ): Promise<{ result: OllamaResponse | null; text: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          images: [imgBase64],
          stream: false,
          format: 'json',
          options: {
            temperature: 0,
            top_p: 0.9,
            num_predict: numPredict,
          },
        }),
        signal: AbortSignal.timeout(120_000),
      });

      if (!response.ok) {
        console.error(`Ollama error: ${response.status}`);
        return { result: null, text: '' };
      }

      const result = (await response.json()) as OllamaResponse;
      const text = typeof result?.response === 'string' ? result.response.trim() : '';
      return { result, text };
    } catch (error) {
      console.error('Ollama request failed:', error);
      return { result: null, text: '' };
    }
  }

  async solveGrid(
    screenshotBase64: string,
    targetObject: string,
    gridSize: number = 9,
  ): Promise<number[]> {
    try {
      const prompt = this.buildGridPrompt(targetObject, gridSize);

      let { result, text } = await this.callOllamaJson(prompt, screenshotBase64, 80);

      if (!result) {
        return [];
      }

      // If output was truncated, retry with a larger token budget
      if (result.done_reason === 'length') {
        console.warn('Ollama output truncated. Retrying with higher num_predict...');
        const retry = await this.callOllamaJson(prompt, screenshotBase64, 180);
        if (retry.result && retry.text) {
          result = retry.result;
          text = retry.text;
        }
      }

      if (!text) {
        console.warn('Empty response from Moondream');
        return [];
      }

      return this.parseCells(text, gridSize);
    } catch (error) {
      console.error('MoondreamDetector error:', error);
      return [];
    }
  }

  private parseCells(text: string, gridSize: number): number[] {
    let cells: number[] = [];

    try {
      let cleanText = text.trim();
      if (cleanText.includes('```json')) {
        cleanText = cleanText.split('```json')[1].split('```')[0].trim();
      } else if (cleanText.includes('```')) {
        cleanText = cleanText.split('```')[1].split('```')[0].trim();
      }

      const solution = JSON.parse(cleanText) as GridSolution | number[];

      if (Array.isArray(solution)) {
        const allFloat = solution.every(
          (x) => typeof x === 'number' && !Number.isInteger(x) && x >= 0 && x <= 1,
        );
        if (allFloat) {
          console.warn('Moondream returned coordinates, not cell numbers:', solution);
          return [];
        }
        cells = solution
          .filter((x): x is number => typeof x === 'number')
          .map((x) => Math.trunc(x))
          .filter((x) => x >= 0 && x < gridSize);
      } else if (typeof solution === 'object' && solution !== null) {
        const raw = solution.cells;
        if (Array.isArray(raw)) {
          cells = raw
            .filter((x): x is number => typeof x === 'number')
            .filter((x) => x >= 0 && x < gridSize);
        }
      }
    } catch {
      // Fallback: extract numbers from text using regex
      const numbers = text.match(/\b\d+\b/g) ?? [];
      cells = numbers
        .map(Number)
        .filter((n) => n >= 0 && n < gridSize);
    }

    if (!Array.isArray(cells)) {
      return [];
    }

    // Validate, deduplicate, and limit
    const seen = new Set<number>();
    const unique: number[] = [];
    for (const c of cells) {
      if (typeof c === 'number' && c >= 0 && c < gridSize && !seen.has(c)) {
        seen.add(c);
        unique.push(c);
      }
    }

    return unique.slice(0, 5);
  }
}
