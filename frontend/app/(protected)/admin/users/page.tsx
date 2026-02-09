'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS } from '@/infrastructure/graphql/queries/admin.queries';
import { UPDATE_USER_ROLES, DELETE_USER } from '@/infrastructure/graphql/mutations/admin.mutations';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

const AVAILABLE_ROLES = ['admin', 'organizer', 'participant'];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { page, limit: 10, search: search || undefined, role: roleFilter || undefined },
  });

  const [updateUserRoles, { loading: updatingRoles }] = useMutation(UPDATE_USER_ROLES, {
    onCompleted: () => {
      setEditingUser(null);
      refetch();
    },
  });

  const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
    onCompleted: () => refetch(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch({ page: 1, search: search || undefined, role: roleFilter || undefined });
  };

  const handleEditRoles = (user: User) => {
    setEditingUser(user);
    setSelectedRoles(user.roles);
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    await updateUserRoles({
      variables: { userId: editingUser.id, roles: selectedRoles },
    });
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      await deleteUser({ variables: { userId } });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600';
      case 'organizer':
        return 'bg-blue-600';
      case 'participant':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        Error loading users: {error.message}
      </div>
    );
  }

  const users = data?.users?.users || [];
  const total = data?.users?.total || 0;
  const totalPages = data?.users?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-1">Manage all users and their roles</p>
        </div>
        <div className="text-gray-400">
          Total: <span className="text-white font-semibold">{total}</span> users
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#2a2a2a] rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Roles</option>
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Roles</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Verified</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user: User) => (
              <tr key={user.id} className="hover:bg-[#3a3a3a] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-gray-500 text-sm">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 text-xs font-medium text-white rounded ${getRoleBadgeColor(role)}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.isEmailVerified ? (
                    <span className="text-green-500">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditRoles(user)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Edit Roles
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={deletingUser}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Roles Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Edit Roles for {editingUser.firstName} {editingUser.lastName}
            </h2>
            <p className="text-gray-400 text-sm mb-4">{editingUser.email}</p>

            <div className="space-y-3 mb-6">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles([...selectedRoles, role]);
                      } else {
                        setSelectedRoles(selectedRoles.filter((r) => r !== role));
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-white font-medium capitalize">{role}</div>
                    <div className="text-gray-500 text-sm">
                      {role === 'admin' && 'Full access to all features'}
                      {role === 'organizer' && 'Can create and manage events'}
                      {role === 'participant' && 'Can view events and make reservations'}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                disabled={updatingRoles || selectedRoles.length === 0}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {updatingRoles ? 'Saving...' : 'Save Roles'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
