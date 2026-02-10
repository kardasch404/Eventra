'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS } from '@/infrastructure/graphql/queries/admin.queries';
import { UPDATE_USER_ROLES, DELETE_USER } from '@/infrastructure/graphql/mutations/admin.mutations';

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const UsersIconLarge = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

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

interface UsersData {
  users: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const AVAILABLE_ROLES = ['admin', 'organizer', 'participant'];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);

  // Debounce search to avoid excessive API calls
  const debouncedSearch = useDebounce(search, 500);

  const { data, loading, error, refetch } = useQuery<UsersData>(GET_USERS, {
    variables: { page, limit: 10, search: debouncedSearch || undefined, role: roleFilter || undefined },
  });

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const [updateUserRoles, { loading: updatingRoles }] = useMutation(UPDATE_USER_ROLES, {
    onCompleted: () => {
      setEditingUser(null);
      refetch();
    },
  });

  const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      setDeleteModalOpen(false);
      setUserToDelete(null);
      refetch();
    },
  });

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

  const handleDeleteClick = (userId: string, email: string) => {
    setUserToDelete({ id: userId, email });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser({ variables: { userId: userToDelete.id } });
    }
  };

  const clearSearch = () => {
    setSearch('');
    setRoleFilter('');
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
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Error loading users: {error.message}</span>
        </div>
      </div>
    );
  }

  const users = data?.users?.users || [];
  const total = data?.users?.total || 0;
  const totalPages = data?.users?.totalPages || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <UsersIconLarge />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Users Management</h1>
            <p className="text-gray-400">Manage all users and their roles</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-[#1a1a1a] rounded-xl border border-gray-800/50 text-gray-400">
          Total: <span className="text-white font-semibold">{total}</span> users
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800/50">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <XIcon />
              </button>
            )}
          </div>
          <div className="w-52">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="">All Roles</option>
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {(search || roleFilter) && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        {loading && (
          <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <span>Searching...</span>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f0f0f]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-[#252525] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium shadow-md">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-500 text-xs">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`px-2.5 py-1 text-xs font-medium text-white rounded-lg ${getRoleBadgeColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-400 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditRoles(user)}
                        className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Edit Roles
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id, user.email)}
                        className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <UsersIconLarge />
            </div>
            <p className="text-gray-400">No users found matching your criteria</p>
            {(search || roleFilter) && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-2xl border border-gray-800/50">
          <div className="text-gray-400">
            Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#0f0f0f] hover:bg-[#252525] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#0f0f0f] hover:bg-[#252525] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Roles Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Edit Roles
                </h2>
                <p className="text-gray-400 text-sm mt-1">{editingUser.firstName} {editingUser.lastName}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedRoles.includes(role)
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : 'bg-[#0f0f0f] border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    selectedRoles.includes(role)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    {selectedRoles.includes(role) && <CheckIcon />}
                  </div>
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
                    className="sr-only"
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

            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                disabled={updatingRoles || selectedRoles.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 shadow-lg shadow-orange-500/25"
              >
                {updatingRoles ? 'Saving...' : 'Save Roles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Delete User</h2>
              <p className="text-gray-400 text-center">
                Are you sure you want to delete <span className="text-white font-medium">{userToDelete.email}</span>?
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingUser}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
              >
                {deletingUser ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
