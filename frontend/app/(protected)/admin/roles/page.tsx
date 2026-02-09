'use client';

export default function RolesPermissionsPage() {
  const roles = [
    { id: '1', name: 'Admin', permissions: ['admin:access', 'event:create', 'event:delete', 'reservation:manage'] },
    { id: '2', name: 'Organizer', permissions: ['event:create', 'event:edit', 'reservation:view'] },
    { id: '3', name: 'User', permissions: ['event:view', 'reservation:create'] },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>

      <div className="grid gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{role.name}</h2>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span key={permission} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          Note: Role and permission management will be fully implemented when the backend supports it.
        </p>
      </div>
    </div>
  );
}
