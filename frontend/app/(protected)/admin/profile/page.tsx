'use client';

import { useAuth } from '@/presentation/hooks/useAuth';
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CHANGE_PASSWORD } from '@/infrastructure/graphql/mutations';
import { GET_ADMIN_STATS } from '@/infrastructure/graphql/queries/admin.queries';
import { Button } from '@/presentation/components/ui';

// SVG Icons
const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

interface AdminStatsData {
  adminStats: {
    totalUsers: number;
    totalEvents: number;
    totalReservations: number;
    confirmedReservations: number;
    pendingReservations: number;
    publishedEvents: number;
  };
}

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const { data: statsData } = useQuery<AdminStatsData>(GET_ADMIN_STATS);

  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: () => {
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    },
    onError: (error) => {
      setPasswordError(error.message);
    },
  });

  const handleSave = async () => {
    // TODO: Implement profile update mutation
    setIsEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    await changePassword({
      variables: {
        input: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = statsData?.adminStats;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
        {!isEditing && (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="border-orange-500 text-orange-500 hover:bg-orange-500/10 flex items-center gap-2"
          >
            <PencilIcon />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-10">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20 shadow-xl">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-orange-100 mt-1">{user.email}</p>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 mt-3 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                <CrownIcon />
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8">
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
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="mt-2 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
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
                <div className="p-4 bg-[#0f0f0f] rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    First Name
                  </label>
                  <p className="text-white text-lg font-medium">{user.firstName}</p>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <p className="text-white text-lg font-medium">{user.lastName}</p>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-white text-lg font-medium">{user.email}</p>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-xl">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <p className="text-white text-lg font-medium">Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <CalendarIcon />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Events Managed</p>
              <p className="text-3xl font-bold text-white">{stats?.totalEvents || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
              <CheckCircleIcon />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Reservations Approved</p>
              <p className="text-3xl font-bold text-white">{stats?.confirmedReservations || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <UsersIcon />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <ShieldIcon />
          </div>
          <h3 className="text-xl font-semibold text-white">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl hover:bg-[#151515] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                <KeyIcon />
              </div>
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-sm text-gray-500">Last changed: Recently</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-orange-500 hover:text-orange-400 transition-all"
            >
              Change Password
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-xl hover:bg-[#151515] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                <LockIcon />
              </div>
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-green-500 hover:text-green-400 transition-all"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <KeyIcon />
                </div>
                <h2 className="text-xl font-bold text-white">Change Password</h2>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              {passwordError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
                  <CheckCircleIcon />
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-3 pr-12 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pr-12 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Enter new password (min 8 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 shadow-lg shadow-orange-500/25"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
