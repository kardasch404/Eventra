export class DateTime {
  start: Date;
  end: Date;
  timezone: string;
  display: string;
  duration: string;

  constructor(data: Partial<DateTime>) {
    Object.assign(this, data);
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
