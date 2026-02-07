export class CreateRoleDto {
  name: string;
  slug: string;
  description: string;
  isSystem?: boolean;
}
