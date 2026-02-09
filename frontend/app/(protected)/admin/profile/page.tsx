'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useState } from 'react';
import { Button, Input } from '@/presentation/components/ui';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    // TODO: Implement profile update mutation
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
        {!isEditing && (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="border-orange-600 text-orange-600 hover:bg-orange-600/10"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-orange-100">{user.email}</p>
              <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-white/20 text-white">
                👑 Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name
                  </label>
                  <p className="text-white text-lg">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name
                  </label>
                  <p className="text-white text-lg">{user.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <p className="text-white text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Role
                  </label>
                  <p className="text-white text-lg">Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Events Managed</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
          </div>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reservations Approved</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
          </div>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="text-white font-medium">Password</p>
              <p className="text-sm text-gray-400">Last changed: Unknown</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Change Password
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
