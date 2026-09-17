import { MoondreamDetector, DEFAULT_SOLVER_CONFIG } from '@/infrastructure/services/moondream-detector.service';
import { CaptchaSolver } from '@/infrastructure/services/captcha-solver.service';
import type { BrowserPage, BrowserFrame, BrowserElement } from '@/infrastructure/services/captcha-solver.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function base64FromString(str: string): string {
  return Buffer.from(str).toString('base64');
}

function makeElement(overrides: Partial<BrowserElement> = {}): BrowserElement {
  return {
    click: jest.fn().mockResolvedValue(undefined),
    isVisible: jest.fn().mockResolvedValue(true),
    screenshot: jest.fn().mockResolvedValue(new Uint8Array([0, 1, 2])),
    innerText: jest.fn().mockResolvedValue(''),
    ...overrides,
  };
}

function makeFrame(overrides: Partial<BrowserFrame> = {}): BrowserFrame {
  return {
    url: 'https://example.com',
    querySelector: jest.fn().mockResolvedValue(null),
    querySelectorAll: jest.fn().mockResolvedValue([]),
    locator: jest.fn().mockReturnValue({
      screenshot: jest.fn().mockResolvedValue(new Uint8Array([0, 1, 2])),
    }),
    ...overrides,
  };
}

function makePage(
  frames: BrowserFrame[] = [],
  url = 'https://www.google.com/sorry/captcha',
): BrowserPage {
  return {
    url,
    frames,
    reload: jest.fn().mockResolvedValue(undefined),
  };
}

/** Drain all pending fake timers then return the result of the promise. */
async function runWithFakeTimers<T>(promise: Promise<T>): Promise<T> {
  await jest.runAllTimersAsync();
  return promise;
}

// ---------------------------------------------------------------------------
// MoondreamDetector
// ---------------------------------------------------------------------------

describe('DEFAULT_SOLVER_CONFIG', () => {
  it('has expected default values', () => {
    expect(DEFAULT_SOLVER_CONFIG.moondreamModel).toBe('llava-phi3');
    expect(DEFAULT_SOLVER_CONFIG.ollamaUrl).toBe('http://localhost:11434');
    expect(DEFAULT_SOLVER_CONFIG.useMoondream).toBe(true);
    expect(DEFAULT_SOLVER_CONFIG.useAudio).toBe(false);
    expect(DEFAULT_SOLVER_CONFIG.maxAttempts).toBe(3);
  });
});

describe('MoondreamDetector', () => {
  let detector: MoondreamDetector;

  beforeEach(() => {
    detector = new MoondreamDetector();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns empty array when Ollama returns non-200', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503 });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([]);
  });

  it('returns empty array when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([]);
  });

  it('parses {"cells":[0,3]} response correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ response: '{"cells":[0,3]}', done_reason: 'stop' }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([0, 3]);
  });

  it('parses direct array response [1,5]', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ response: '[1,5]', done_reason: 'stop' }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'bus');
    expect(cells).toEqual([1, 5]);
  });

  it('ignores float coordinate responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        response: '[0.12, 0.43, 0.78]',
        done_reason: 'stop',
      }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([]);
  });

  it('falls back to regex when JSON is invalid', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ response: 'cells: 2 and 4', done_reason: 'stop' }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toContain(2);
    expect(cells).toContain(4);
  });

  it('deduplicates repeated cell indices', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        response: '{"cells":[1,1,2,2,3]}',
        done_reason: 'stop',
      }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([1, 2, 3]);
  });

  it('limits output to 5 cells', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        response: '{"cells":[0,1,2,3,4,5,6]}',
        done_reason: 'stop',
      }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells.length).toBeLessThanOrEqual(5);
  });

  it('filters cells outside grid bounds', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        response: '{"cells":[0,8,9,15,16]}',
        done_reason: 'stop',
      }),
    });
    // gridSize = 9 → valid indices: 0-8
    const cells = await detector.solveGrid(base64FromString('img'), 'car', 9);
    expect(cells.every((c) => c >= 0 && c < 9)).toBe(true);
  });

  it('retries when done_reason is "length"', async () => {
    const firstResponse = { response: '{"cells":[0', done_reason: 'length' };
    const retryResponse = { response: '{"cells":[0,1]}', done_reason: 'stop' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(firstResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(retryResponse),
      });

    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(cells).toEqual([0, 1]);
  });

  it('strips markdown code block wrapper from response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ response: '```json\n{"cells":[3]}\n```', done_reason: 'stop' }),
    });
    const cells = await detector.solveGrid(base64FromString('img'), 'car');
    expect(cells).toEqual([3]);
  });

  it('uses 4x4 grid prompt when gridSize is 16', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ response: '{"cells":[0]}', done_reason: 'stop' }),
    });
    await detector.solveGrid(base64FromString('img'), 'car', 16);
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body as string) as {
      prompt: string;
    };
    expect(body.prompt).toContain('4x4');
  });

  it('accepts custom config', () => {
    const custom = new MoondreamDetector({
      ...DEFAULT_SOLVER_CONFIG,
      moondreamModel: 'custom-model',
      ollamaUrl: 'http://custom:11434',
    });
    expect(custom).toBeInstanceOf(MoondreamDetector);
  });
});

// ---------------------------------------------------------------------------
// CaptchaSolver
// ---------------------------------------------------------------------------

describe('CaptchaSolver', () => {
  let solver: CaptchaSolver;

  beforeEach(() => {
    jest.useFakeTimers();
    solver = new CaptchaSolver();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('returns false when URL is not a CAPTCHA page', async () => {
    const page = makePage([], 'https://eventra.app/events');
    const result = await runWithFakeTimers(solver.solveCaptcha(page));
    expect(result).toBe(false);
  });

  it('returns false when no checkbox iframe is found', async () => {
    const page = makePage([], 'https://www.google.com/sorry/captcha');
    const result = await runWithFakeTimers(solver.solveCaptcha(page, 1));
    expect(result).toBe(false);
  });

  it('returns false when checkbox cannot be clicked', async () => {
    const checkboxFrame = makeFrame({
      url: 'https://www.google.com/recaptcha/api2/anchor?hl=en',
      querySelector: jest.fn().mockResolvedValue(null),
    });
    const page = makePage([checkboxFrame]);
    const result = await runWithFakeTimers(solver.solveCaptcha(page, 1));
    expect(result).toBe(false);
  });

  it('returns true when checkbox click resolves CAPTCHA (no challenge iframe)', async () => {
    let currentUrl = 'https://www.google.com/sorry/captcha';

    const checkbox = makeElement({
      click: jest.fn().mockImplementation(async () => {
        currentUrl = 'https://eventra.app/events';
      }),
    });

    const checkboxFrame = makeFrame({
      url: 'https://www.google.com/recaptcha/api2/anchor?hl=en',
      querySelector: jest.fn().mockResolvedValue(checkbox),
    });

    const page: BrowserPage = {
      get url() {
        return currentUrl;
      },
      frames: [checkboxFrame],
      reload: jest.fn().mockResolvedValue(undefined),
    };

    const result = await runWithFakeTimers(solver.solveCaptcha(page, 1));
    expect(result).toBe(true);
  });

  it('returns false when Moondream returns no cells for challenge', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503 });

    const checkbox = makeElement();
    const checkboxFrame = makeFrame({
      url: 'https://www.google.com/recaptcha/api2/anchor',
      querySelector: jest.fn().mockResolvedValue(checkbox),
    });

    const descElem = makeElement({ innerText: jest.fn().mockResolvedValue('cars') });
    const challengeFrame = makeFrame({
      url: 'https://www.google.com/recaptcha/api2/bframe',
      querySelector: jest.fn().mockImplementation((sel: string) => {
        if (sel === '.rc-imageselect-desc strong') return descElem;
        return null;
      }),
      querySelectorAll: jest.fn().mockResolvedValue([]),
    });

    const page = makePage([checkboxFrame, challengeFrame]);
    const result = await runWithFakeTimers(solver.solveCaptcha(page, 1));
    expect(result).toBe(false);
  });

  it('creates solver without Moondream when useMoondream is false', () => {
    const noMoondream = new CaptchaSolver({ ...DEFAULT_SOLVER_CONFIG, useMoondream: false });
    expect(noMoondream).toBeInstanceOf(CaptchaSolver);
  });

  it('close() does not throw', () => {
    expect(() => solver.close()).not.toThrow();
  });

  describe('target extraction – language detection', () => {
    const cases: Array<{ lang: string; input: string; expected: string }> = [
      { lang: 'English', input: 'Select all traffic lights', expected: 'traffic light' },
      { lang: 'English', input: 'Select all cars', expected: 'car' },
      { lang: 'English', input: 'Select all fire hydrants', expected: 'fire hydrant' },
      { lang: 'Arabic', input: 'اختر سيارات', expected: 'car' },
      { lang: 'Arabic', input: 'اختر حافلات', expected: 'bus' },
      { lang: 'French', input: 'Sélectionnez les voitures', expected: 'car' },
      { lang: 'French', input: 'Sélectionnez les vélos', expected: 'bicycle' },
    ];

    cases.forEach(({ lang, input, expected }) => {
      it(`translates ${lang} "${input}" to "${expected}"`, async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({ response: '{"cells":[]}', done_reason: 'stop' }),
        });

        const descElem = makeElement({ innerText: jest.fn().mockResolvedValue(input) });
        const checkbox = makeElement();

        const checkboxFrame = makeFrame({
          url: 'https://www.google.com/recaptcha/api2/anchor',
          querySelector: jest.fn().mockResolvedValue(checkbox),
        });

        const challengeFrame = makeFrame({
          url: 'https://www.google.com/recaptcha/api2/bframe',
          querySelector: jest.fn().mockImplementation((sel: string) => {
            if (sel === '.rc-imageselect-desc strong') return descElem;
            return null;
          }),
          querySelectorAll: jest.fn().mockResolvedValue([]),
        });

        const page = makePage([checkboxFrame, challengeFrame]);
        await runWithFakeTimers(solver.solveCaptcha(page, 1));

        // Verify fetch was called with the translated target in the prompt
        if ((global.fetch as jest.Mock).mock.calls.length > 0) {
          const body = JSON.parse(
            (global.fetch as jest.Mock).mock.calls[0][1].body as string,
          ) as { prompt: string };
          expect(body.prompt.toLowerCase()).toContain(expected);
        }
      });
    });
  });
});
