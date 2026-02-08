'use client';

import { useState } from 'react';
import { Button, Modal } from '@/presentation/components/ui';

const ROLES = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['admin:access', 'events:manage', 'reservations:manage', 'users:manage'],
  },
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
  const [editingRole, setEditingRole] = useState<{ id: string; name: string; permissions: string[] } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (role: { id: string; name: string; permissions: string[] }) => {
    setEditingRole({ ...role });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingRole) {
      setRoles(roles.map((r) => (r.id === editingRole.id ? editingRole : r)));
    }
    setShowModal(false);
  };

  const togglePermission = (permission: string) => {
    if (!editingRole) return;
    const permissions = editingRole.permissions.includes(permission)
      ? editingRole.permissions.filter((p: string) => p !== permission)
      : [...editingRole.permissions, permission];
    setEditingRole({ ...editingRole, permissions });
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
      </div>

      <div className="p-6 space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{role.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Role ID: {role.id}</p>
              </div>
              <Button onClick={() => handleEdit(role)} variant="secondary" size="sm">
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span key={permission} className="px-3 py-1 bg-orange-900/30 text-orange-400 text-sm rounded-full">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
            <input
              value={editingRole?.name || ''}
              onChange={(e) => editingRole && setEditingRole({ ...editingRole, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
            <div className="space-y-2 max-h-64 overflow-y-auto bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label key={permission} className="flex items-center space-x-3 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded">
                  <input
                    type="checkbox"
                    checked={editingRole?.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0a] text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-300">{permission}</span>
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
