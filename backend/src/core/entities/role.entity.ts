export class Role {
  id: string; // UUID v7
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Role>) {
    Object.assign(this, data);
    this.isSystem = data.isSystem ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  isAdminRole(): boolean {
    return this.slug === 'admin';
  }

  isParticipantRole(): boolean {
    return this.slug === 'participant';
  }
}
