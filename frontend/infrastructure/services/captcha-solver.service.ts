import { MoondreamDetector, DEFAULT_SOLVER_CONFIG, type SolverConfig } from './moondream-detector.service';

/** Minimal interface describing the browser page capabilities needed by CaptchaSolver. */
export interface BrowserFrame {
  url: string;
  querySelector(selector: string): Promise<BrowserElement | null>;
  querySelectorAll(selector: string): Promise<BrowserElement[]>;
  locator(selector: string): BrowserLocator;
}

export interface BrowserLocator {
  screenshot(): Promise<Uint8Array>;
}

export interface BrowserElement {
  click(): Promise<void>;
  isVisible(): Promise<boolean>;
  screenshot(): Promise<Uint8Array>;
  innerText(): Promise<string>;
}

export interface BrowserPage {
  url: string;
  frames: BrowserFrame[];
  reload(options?: { wait_until?: string }): Promise<void>;
}

const ARABIC_TO_ENGLISH: Record<string, string> = {
  سيارات: 'car',
  سيارة: 'car',
  حافلات: 'bus',
  حافلة: 'bus',
  دراجات: 'bicycle',
  دراجة: 'bicycle',
  'دراجات نارية': 'motorcycle',
  'دراجة نارية': 'motorcycle',
  جسور: 'bridge',
  جسر: 'bridge',
  'إشارات مرور': 'traffic light',
  'إشارة مرور': 'traffic light',
  سلالم: 'stairs',
  سلم: 'stairs',
  درج: 'stairs',
  'دَرَج': 'stairs',
  جبال: 'mountain',
  جبل: 'mountain',
  'معابر مشاة': 'crosswalk',
  'معبر مشاة': 'crosswalk',
  'صنابير حريق': 'fire hydrant',
  'صنبور حريق': 'fire hydrant',
  'محبس إطفاء حريق': 'fire hydrant',
  'صنبور الإطفاء': 'fire hydrant',
};

const FRENCH_TO_ENGLISH: Record<string, string> = {
  voitures: 'car',
  voiture: 'car',
  bus: 'bus',
  vélos: 'bicycle',
  vélo: 'bicycle',
  motos: 'motorcycle',
  moto: 'motorcycle',
  ponts: 'bridge',
  pont: 'bridge',
  feux: 'traffic light',
  feu: 'traffic light',
  escaliers: 'stairs',
  escalier: 'stairs',
  montagnes: 'mountain',
  montagne: 'mountain',
};

const ENGLISH_KEYWORDS: Record<string, string> = {
  car: 'car',
  vehicle: 'car',
  bus: 'bus',
  buses: 'bus',
  'traffic light': 'traffic light',
  bicycle: 'bicycle',
  bike: 'bicycle',
  motorcycle: 'motorcycle',
  bridge: 'bridge',
  crosswalk: 'crosswalk',
  'fire hydrant': 'fire hydrant',
  stairs: 'stairs',
  mountain: 'mountain',
};

/** Milliseconds to wait for the reCAPTCHA challenge iframe to appear after clicking the checkbox. */
const CHALLENGE_DETECTION_DELAY = 7000;

function sleep(ms: number): Promise<void> {
  const delay = Math.max(0, ms);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export class CaptchaSolver {
  private readonly moondream: MoondreamDetector | null;
  private readonly config: SolverConfig;

  constructor(config: SolverConfig = DEFAULT_SOLVER_CONFIG) {
    this.config = config;
    this.moondream = config.useMoondream ? new MoondreamDetector(config) : null;
  }

  async solveCaptcha(page: BrowserPage, maxAttempts: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const success = await this.solveCaptchaOnce(page);

      if (success) {
        return true;
      }

      if (attempt < maxAttempts) {
        try {
          await page.reload({ wait_until: 'domcontentloaded' });
          await sleep(3000);
        } catch (error) {
          console.error('Page reload failed:', error);
        }
      }
    }

    return false;
  }

  private async solveCaptchaOnce(page: BrowserPage): Promise<boolean> {
    const currentUrl = page.url;
    if (!currentUrl.includes('sorry') && !currentUrl.includes('captcha')) {
      return false;
    }

    // Find checkbox iframe
    const checkboxFrame = page.frames.find(
      (frame) => frame.url.includes('recaptcha') && frame.url.includes('anchor'),
    );

    if (!checkboxFrame) {
      return false;
    }

    // Click checkbox
    const clicked = await this.clickCheckbox(checkboxFrame);
    if (!clicked) {
      return false;
    }

    await sleep(this.config.waitAfterClick * 1000 + CHALLENGE_DETECTION_DELAY);

    // Check for challenge iframe
    const challengeFrame = page.frames.find(
      (frame) => frame.url.includes('recaptcha') && frame.url.includes('bframe'),
    );

    if (!challengeFrame) {
      const urlAfterClick = page.url;
      return !urlAfterClick.includes('sorry') && !urlAfterClick.includes('captcha');
    }

    return this.solveChallenge(page, challengeFrame);
  }

  private async clickCheckbox(checkboxFrame: BrowserFrame): Promise<boolean> {
    const selectors = [
      '#recaptcha-anchor',
      '.recaptcha-checkbox-border',
      '.recaptcha-checkbox',
      'div.recaptcha-checkbox-border',
    ];

    await sleep(2000);

    for (const selector of selectors) {
      try {
        const element = await checkboxFrame.querySelector(selector);
        if (!element) continue;

        const isVisible = await element.isVisible();
        if (isVisible) {
          await element.click();
          return true;
        }
      } catch {
        // Try next selector
      }
    }

    return false;
  }

  private async solveChallenge(page: BrowserPage, challengeFrame: BrowserFrame): Promise<boolean> {
    try {
      await sleep(3000);

      // Detect grid size
      const grid44 = await challengeFrame.querySelector('.rc-imageselect-table-44');
      const gridSize = grid44 ? 16 : 9;

      // Extract target object
      const target = await this.extractTarget(challengeFrame);
      if (!target) {
        return false;
      }

      // Take screenshot
      const challengeElem = await challengeFrame.querySelector('.rc-imageselect-challenge');
      const screenshotBytes = challengeElem
        ? await challengeElem.screenshot()
        : await challengeFrame.locator('body').screenshot();

      if (!this.moondream) {
        return false;
      }

      const screenshotBase64 = uint8ToBase64(screenshotBytes);
      const cells = await this.moondream.solveGrid(screenshotBase64, target, gridSize);

      if (!cells.length) {
        return false;
      }

      // Click tiles
      const tiles = await challengeFrame.querySelectorAll('.rc-imageselect-tile');
      for (const cellIdx of cells) {
        if (cellIdx < tiles.length) {
          await tiles[cellIdx].click();
          await sleep(500);
        }
      }

      // Handle dynamic tiles
      await sleep(3000);
      const dynamicTiles = await challengeFrame.querySelectorAll(
        '.rc-imageselect-dynamic-selected',
      );
      if (dynamicTiles.length) {
        const newScreenshotBytes = challengeElem
          ? await challengeElem.screenshot()
          : await challengeFrame.locator('body').screenshot();

        const newBase64 = uint8ToBase64(newScreenshotBytes);
        const newCells = await this.moondream.solveGrid(newBase64, target, gridSize);

        if (newCells.length) {
          const updatedTiles = await challengeFrame.querySelectorAll('.rc-imageselect-tile');
          for (const cellIdx of newCells) {
            if (cellIdx < updatedTiles.length) {
              await updatedTiles[cellIdx].click();
              await sleep(500);
            }
          }
          await sleep(2000);
        }
      }

      // Click verify
      await sleep(2000);
      const verifyBtn = await challengeFrame.querySelector('#recaptcha-verify-button');
      if (verifyBtn) {
        await verifyBtn.click();
      }

      await sleep(this.config.waitAfterVerify * 1000);

      const finalUrl = page.url;
      return !finalUrl.includes('sorry') && !finalUrl.includes('captcha');
    } catch (error) {
      console.error('Challenge solving error:', error);
      return false;
    }
  }

  private async extractTarget(frame: BrowserFrame): Promise<string | null> {
    const selectors = [
      '.rc-imageselect-desc strong',
      '.rc-imageselect-desc-no-canonical strong',
      '.rc-imageselect-desc',
    ];

    for (const selector of selectors) {
      try {
        const element = await frame.querySelector(selector);
        if (!element) continue;

        const text = (await element.innerText()).toLowerCase().trim();
        if (!text) continue;

        for (const [arabic, english] of Object.entries(ARABIC_TO_ENGLISH)) {
          if (text.includes(arabic)) return english;
        }

        for (const [french, english] of Object.entries(FRENCH_TO_ENGLISH)) {
          if (text.includes(french)) return english;
        }

        for (const [keyword, obj] of Object.entries(ENGLISH_KEYWORDS)) {
          if (text.includes(keyword)) return obj;
        }

        return text;
      } catch {
        // Try next selector
      }
    }

    return null;
  }

  close(): void {
    // No persistent connections to close in the TypeScript implementation
  }
}
