import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, UserPlus, BookOpen, User, GraduationCap, ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../api';
import { useAuthStore } from '../store';
import { User as UserType } from '../types';
import { Button, Input, Select, Card } from '../components/ui';

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics', 'Electrical',
  'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Mathematics',
  'Physics', 'Chemistry', 'Commerce', 'Management',
];

const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: '', semester: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department,
        semester: Number(formData.semester),
      };
      const response = await authAPI.register(payload);
      const { user, token } = response.data;
      login(user as UserType, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const departmentOptions = [
    { value: '', label: 'Select your department' },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
  ];

  const semesterOptions = [
    { value: '', label: 'Select semester' },
    ...SEMESTERS,
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-24 right-16 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CampusShare</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join the community
            <br />
            of knowledge sharers.
          </h1>
          <p className="text-lg text-emerald-100 max-w-md leading-relaxed">
            Create your account and start contributing study resources that help thousands of students succeed.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm">
            {['Upload & Share', 'Bookmark & Save', 'Rate & Review', 'Get Recommendations'].map(
              (feature) => (
                <div
                  key={feature}
                  className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-medium"
                >
                  {feature}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CampusShare</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Fill in your details to get started
            </p>
          </div>

          <Card className="p-8 shadow-lg shadow-gray-200/50 dark:shadow-none dark:border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="name"
                name="name"
                type="text"
                label="Full name"
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
              />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@college.edu"
                icon={<Mail className="w-4 h-4" />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />

              <Select
                id="department"
                name="department"
                label="Department"
                options={departmentOptions}
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
              />

              <Select
                id="semester"
                name="semester"
                label="Semester"
                options={semesterOptions}
                value={formData.semester}
                onChange={handleChange}
                error={errors.semester}
              />

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a password"
                  icon={<Lock className="w-4 h-4" />}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  label="Confirm password"
                  placeholder="Re-enter your password"
                  icon={<Lock className="w-4 h-4" />}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                icon={!isLoading ? <UserPlus className="w-4 h-4" /> : undefined}
              >
                Create account
              </Button>
            </form>
          </Card>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 inline-flex items-center gap-1 group transition-colors"
            >
              Sign in
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
