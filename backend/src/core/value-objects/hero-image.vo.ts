export class HeroImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;

  constructor(data: Partial<HeroImage> | null | undefined) {
    this.url = data?.url || '';
    this.alt = data?.alt || '';
    this.width = data?.width;
    this.height = data?.height;
  }

  isValid(): boolean {
    return !!this.url && !!this.alt;
  }
}
