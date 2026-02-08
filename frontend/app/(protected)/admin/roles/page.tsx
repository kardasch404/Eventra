'use client';

import { useState } from 'react';
import { Button, Modal } from '@/presentation/components/ui';

const ROLES = [
  { id: 'admin', name: 'Administrator', permissions: ['admin:access', 'events:manage', 'reservations:manage', 'users:manage'] },
  { id: 'organizer', name: 'Event Organizer', permissions: ['events:create', 'events:edit', 'reservations:view'] },
  { id: 'user', name: 'User', permissions: ['events:view', 'reservations:create'] },
];

const AVAILABLE_PERMISSIONS = [
  'admin:access',
  'events:view',
  'events:create',
  'events:edit',
  'events:delete',
  'events:manage',
  'reservations:view',
  'reservations:create',
  'reservations:manage',
  'users:manage',
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState(ROLES);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (role: any) => {
    setEditingRole({ ...role });
    setShowModal(true);
  };

  const handleSave = () => {
    setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    setShowModal(false);
  };

  const togglePermission = (permission: string) => {
    const permissions = editingRole.permissions.includes(permission)
      ? editingRole.permissions.filter((p: string) => p !== permission)
      : [...editingRole.permissions, permission];
    setEditingRole({ ...editingRole, permissions });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold">{role.name}</h3>
                <p className="text-sm text-gray-600">Role ID: {role.id}</p>
              </div>
              <Button onClick={() => handleEdit(role)} variant="secondary" size="sm">
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Edit Role: ${editingRole?.name || ''}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role Name</label>
              <input
                value={editingRole.name}
                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Permissions</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <label key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded"
                    />
                    <span className="text-sm">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
      </Modal>
    </div>
  );
}
