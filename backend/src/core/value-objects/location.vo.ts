export class Location {
  mode: string; // online, in-person
  country: string;
  city: string;
  address?: string;
  venue?: string;
  coordinates?: { lat: number; lng: number };

  constructor(data: Partial<Location>) {
    Object.assign(this, data);
  }

  isOnline(): boolean {
    return this.mode === 'online';
  }

  getFullAddress(): string {
    if (this.isOnline()) return 'Online Event';
    return [this.venue, this.address, this.city, this.country].filter(Boolean).join(', ');
  }
}
