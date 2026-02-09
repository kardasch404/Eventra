'use client';

import { useState } from 'react';

// SVG Icons
const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: 'crown' | 'group' | 'user';
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const ALL_PERMISSIONS: Permission[] = [
  // Admin Permissions
  { id: 'admin:access', name: 'Admin Access', description: 'Full admin dashboard access', category: 'Admin' },
  { id: 'admin:settings', name: 'Manage Settings', description: 'Change system settings', category: 'Admin' },
  // Event Permissions
  { id: 'event:create', name: 'Create Events', description: 'Create new events', category: 'Events' },
  { id: 'event:edit', name: 'Edit Events', description: 'Edit existing events', category: 'Events' },
  { id: 'event:delete', name: 'Delete Events', description: 'Delete events permanently', category: 'Events' },
  { id: 'event:view', name: 'View Events', description: 'View event details', category: 'Events' },
  { id: 'event:publish', name: 'Publish Events', description: 'Publish events publicly', category: 'Events' },
  // Reservation Permissions
  { id: 'reservation:create', name: 'Create Reservations', description: 'Make reservations', category: 'Reservations' },
  { id: 'reservation:view', name: 'View Reservations', description: 'View reservation details', category: 'Reservations' },
  { id: 'reservation:manage', name: 'Manage Reservations', description: 'Approve/cancel reservations', category: 'Reservations' },
  // User Permissions
  { id: 'user:view', name: 'View Users', description: 'View user profiles', category: 'Users' },
  { id: 'user:manage', name: 'Manage Users', description: 'Edit user details and roles', category: 'Users' },
];

const INITIAL_ROLES: Role[] = [
  { 
    id: '1', 
    name: 'Admin', 
    description: 'Full system access with all permissions',
    permissions: ['admin:access', 'admin:settings', 'event:create', 'event:edit', 'event:delete', 'event:view', 'event:publish', 'reservation:create', 'reservation:view', 'reservation:manage', 'user:view', 'user:manage'],
    color: 'from-red-500 to-orange-500',
    icon: 'crown',
    userCount: 2
  },
  { 
    id: '2', 
    name: 'Organizer', 
    description: 'Can create and manage events',
    permissions: ['event:create', 'event:edit', 'event:view', 'event:publish', 'reservation:view', 'reservation:manage'],
    color: 'from-blue-500 to-cyan-500',
    icon: 'group',
    userCount: 15
  },
  { 
    id: '3', 
    name: 'Participant', 
    description: 'Can view events and make reservations',
    permissions: ['event:view', 'reservation:create', 'reservation:view'],
    color: 'from-green-500 to-emerald-500',
    icon: 'user',
    userCount: 243
  },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'crown':
        return <CrownIcon />;
      case 'group':
        return <UserGroupIcon />;
      case 'user':
        return <UserIcon />;
      default:
        return <UserIcon />;
    }
  };

  const getPermissionCategory = (category: string) => {
    const permissions = ALL_PERMISSIONS.filter(p => p.category === category);
    return permissions;
  };

  const categories = [...new Set(ALL_PERMISSIONS.map(p => p.category))];

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, permissions: selectedPermissions }
          : r
      ));
      setEditingRole(null);
    }
  };

  const handleCreateRole = () => {
    if (newRoleName.trim()) {
      const newRole: Role = {
        id: Date.now().toString(),
        name: newRoleName,
        description: newRoleDescription || `Custom role: ${newRoleName}`,
        permissions: selectedPermissions,
        color: 'from-purple-500 to-pink-500',
        icon: 'user',
        userCount: 0
      };
      setRoles([...roles, newRole]);
      setShowCreateModal(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <ShieldIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
            <p className="text-gray-400">Manage access control for your platform</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedPermissions([]);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
        >
          <PlusIcon />
          Create Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 overflow-hidden hover:border-gray-700/50 transition-all group"
          >
            {/* Role Header */}
            <div className={`bg-gradient-to-r ${role.color} p-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    {getIcon(role.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{role.name}</h2>
                    <p className="text-white/70 text-sm">{role.userCount} users</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditRole(role)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <PencilIcon />
                </button>
              </div>
            </div>

            {/* Role Body */}
            <div className="p-5">
              <p className="text-gray-400 text-sm mb-4">{role.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions ({role.permissions.length})</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.slice(0, 6).map((permission) => (
                    <span 
                      key={permission} 
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0f0f0f] border border-gray-800 text-gray-300 rounded-lg text-xs"
                    >
                      <CheckIcon />
                      {permission.split(':')[1]}
                    </span>
                  ))}
                  {role.permissions.length > 6 && (
                    <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                      +{role.permissions.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All Permissions Reference */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">All Available Permissions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">{category}</h3>
              <div className="space-y-2">
                {getPermissionCategory(category).map(permission => (
                  <div key={permission.id} className="p-3 bg-[#0f0f0f] rounded-xl">
                    <p className="text-white text-sm font-medium">{permission.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{permission.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white">Edit {editingRole.name} Role</h2>
                <p className="text-gray-400 text-sm mt-1">Modify permissions for this role</p>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">{category}</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {getPermissionCategory(category).map(permission => (
                        <label
                          key={permission.id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedPermissions.includes(permission.id)
                              ? 'bg-orange-500/20 border border-orange-500/50'
                              : 'bg-[#0f0f0f] border border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            selectedPermissions.includes(permission.id)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-800 border border-gray-700'
                          }`}>
                            {selectedPermissions.includes(permission.id) && <CheckIcon />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{permission.name}</p>
                            <p className="text-gray-500 text-xs">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setEditingRole(null)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-orange-500/25"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white">Create New Role</h2>
                <p className="text-gray-400 text-sm mt-1">Define a new role with specific permissions</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g., Moderator"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <input
                    type="text"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Describe what this role can do..."
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Select Permissions</h3>
                {categories.map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">{category}</h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {getPermissionCategory(category).map(permission => (
                        <label
                          key={permission.id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedPermissions.includes(permission.id)
                              ? 'bg-orange-500/20 border border-orange-500/50'
                              : 'bg-[#0f0f0f] border border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => togglePermission(permission.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            selectedPermissions.includes(permission.id)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-800 border border-gray-700'
                          }`}>
                            {selectedPermissions.includes(permission.id) && <CheckIcon />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{permission.name}</p>
                            <p className="text-gray-500 text-xs">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRole}
                disabled={!newRoleName.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
