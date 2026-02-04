export class HeroImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;

  constructor(data: Partial<HeroImage>) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return !!this.url && !!this.alt;
  }
}
