export class Permission {
  id: string; // UUID v7
  resource: string; // event, reservation, role, user
  action: string; // create, read, update, delete, cancel, confirm
  slug: string; // event:create, reservation:cancel
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
