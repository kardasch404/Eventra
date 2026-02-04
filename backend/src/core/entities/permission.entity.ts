export class Permission {
  id: string;
  resource: string;
  action: string;
  slug: string;
  description: string;
  createdAt: Date;

  constructor(data: Partial<Permission>) {
    Object.assign(this, data);
    this.createdAt = data.createdAt ?? new Date();
    this.slug = data.slug ?? `${this.resource}:${this.action}`;
  }

  matches(resource: string, action: string): boolean {
    return this.resource === resource && this.action === action;
  }
}
