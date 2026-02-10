export class DateTime {
  start: Date;
  end: Date;
  timezone: string;
  display: string;
  duration: string;

  constructor(data: Partial<DateTime>) {
    this.start = data.start ? new Date(data.start) : new Date();
    this.end = data.end ? new Date(data.end) : new Date();
    this.timezone = data.timezone ?? '';
    this.display = data.display ?? '';
    this.duration = data.duration ?? '';
  }

  getDurationInHours(): number {
    return (this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60);
  }

  hasStarted(): boolean {
    return new Date() >= this.start;
  }

  hasEnded(): boolean {
    return new Date() >= this.end;
  }

  isOngoing(): boolean {
    return this.hasStarted() && !this.hasEnded();
  }
}
