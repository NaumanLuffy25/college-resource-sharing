import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  BookOpen,
  Tag,
  Lock,
  Save,
  Upload,
  Download,
  Edit3,
  Camera,
  Shield,
  Calendar,
  X,
  Plus,
} from 'lucide-react';
import { authAPI } from '../api';
import { useAuthStore } from '../store';
import { Button, Card, CardHeader, CardTitle, Input, Badge, Skeleton } from '../components/ui';
import { formatDate, getDepartmentColor } from '../utils';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
];

const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    semester: 1,
    interests: [] as string[],
  });
  const [interestInput, setInterestInput] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await authAPI.getMe();
        const profile = res.data.data || res.data.user || res.data;
        setUser(profile);
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          department: profile.department || '',
          semester: profile.semester || 1,
          interests: profile.interests || [],
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await authAPI.updateProfile(form);
      const updated = res.data.data || res.data.user || res.data;
      setUser(updated);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsChangingPwd(true);
    setError('');
    setSuccess('');
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
      setSuccess('Password changed successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const addInterest = () => {
    const val = interestInput.trim();
    if (val && !form.interests.includes(val)) {
      setForm((f) => ({ ...f, interests: [...f.interests, val] }));
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setForm((f) => ({ ...f, interests: f.interests.filter((i) => i !== interest) }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-48 w-full rounded-2xl" />
          <Skeleton className="mb-4 h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-50">My Profile</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
            {success}
          </div>
        )}

        <Card className="mb-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-3xl font-bold text-white">
                {form.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-md dark:bg-gray-900">
                <Camera size={14} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name || form.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || form.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className={getDepartmentColor(form.department)}>{form.department || 'N/A'}</Badge>
                <Badge variant="primary">Semester {form.semester}</Badge>
                <Badge>
                  <Shield size={12} className="mr-1" />
                  {user?.role || 'student'}
                </Badge>
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<Edit3 size={16} />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card hover padding="sm" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900/30">
              <Upload size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user?.uploadCount || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Uploads</p>
            </div>
          </Card>
          <Card hover padding="sm" className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 dark:bg-emerald-900/30">
              <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {user?.downloadCount || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
            </div>
          </Card>
          <Card hover padding="sm" className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2.5 dark:bg-amber-900/30">
              <Calendar size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  icon={<User size={16} />}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Email"
                  icon={<Mail size={16} />}
                  value={form.email}
                  disabled
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={form.department}
                      onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="Semester"
                  type="number"
                  min={1}
                  max={8}
                  icon={<BookOpen size={16} />}
                  value={form.semester}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, semester: parseInt(e.target.value) || 1 }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interests
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest..."
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    icon={<Tag size={16} />}
                  />
                  <Button variant="secondary" icon={<Plus size={16} />} onClick={addInterest}>
                    Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.interests.map((interest) => (
                    <Badge key={interest} variant="primary" className="gap-1">
                      {interest}
                      <button onClick={() => removeInterest(interest)} className="ml-1">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                  {form.interests.length === 0 && (
                    <p className="text-xs text-gray-400">No interests added yet</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  icon={<Save size={16} />}
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{form.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{form.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {form.department || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Semester</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{form.semester}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.interests.length > 0 ? (
                    form.interests.map((i) => <Badge key={i}>{i}</Badge>)
                  ) : (
                    <p className="text-xs text-gray-400">None</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Change Password</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                icon={<Lock size={16} />}
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {isChangingPassword ? 'Cancel' : 'Change'}
              </Button>
            </div>
          </CardHeader>
          {isChangingPassword ? (
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                icon={<Lock size={16} />}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
              />
              <Input
                label="New Password"
                type="password"
                icon={<Lock size={16} />}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                }
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={<Lock size={16} />}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
              />
              <div className="flex justify-end">
                <Button
                  icon={<Lock size={16} />}
                  isLoading={isChangingPwd}
                  onClick={handleChangePassword}
                >
                  Update Password
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Keep your account secure by using a strong password.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
