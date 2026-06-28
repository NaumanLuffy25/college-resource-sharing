import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft, BookOpen, CheckCircle, ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../api';
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

type Step = 'email' | 'verify' | 'reset' | 'success';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'email', label: 'Email', number: 1 },
    { key: 'verify', label: 'Verify', number: 2 },
    { key: 'reset', label: 'Reset', number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Invalid email address' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setStep('verify');
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!department) newErrors.department = 'Department is required';
    if (!semester) newErrors.semester = 'Semester is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await authAPI.forgotPassword({
        email: email.trim(),
        department,
        semester: Number(semester),
      });
      toast.success('Identity verified successfully');
      setStep('reset');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Verification failed. Please check your details.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!newPassword) newErrors.newPassword = 'Password is required';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await authAPI.resetPassword({
        email: email.trim(),
        newPassword,
        department,
        semester: Number(semester),
      });
      toast.success('Password reset successfully!');
      setStep('success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Reset failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-16 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-28 right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CampusShare</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Don't worry,
            <br />
            we've got you.
          </h1>
          <p className="text-lg text-violet-100 max-w-md leading-relaxed">
            Reset your password in a few simple steps. Verify your identity and get back to studying in no time.
          </p>
          <div className="mt-12 space-y-4">
            {['Secure identity verification', 'Quick password recovery', 'No data lost'].map(
              (item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-violet-100">{item}</span>
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
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CampusShare</span>
          </div>

          {/* Step Indicator */}
          {step !== 'success' && (
            <div className="flex items-center gap-3 mb-8">
              {steps.map((s, idx) => (
                <React.Fragment key={s.key}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        idx < currentStepIndex
                          ? 'bg-violet-600 text-white'
                          : idx === currentStepIndex
                          ? 'bg-violet-600 text-white ring-4 ring-violet-600/20'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {idx < currentStepIndex ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        s.number
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:inline ${
                        idx <= currentStepIndex
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                        idx < currentStepIndex
                          ? 'bg-violet-600'
                          : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-5">
                  <KeyRound className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Forgot password?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Enter the email address associated with your account
                </p>
              </div>

              <Card className="p-8 shadow-lg shadow-gray-200/50 dark:shadow-none dark:border-gray-800">
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <Input
                    id="email"
                    type="email"
                    label="Email address"
                    placeholder="you@college.edu"
                    icon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({});
                    }}
                    error={errors.email}
                    autoComplete="email"
                  />
                  <Button type="submit" className="w-full" size="lg">
                    Continue
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* Step 2: Verification */}
          {step === 'verify' && (
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-5">
                  <ShieldCheck className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Verify your identity
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Confirm your department and semester to proceed
                </p>
              </div>

              <Card className="p-8 shadow-lg shadow-gray-200/50 dark:shadow-none dark:border-gray-800">
                <form onSubmit={handleVerifySubmit} className="space-y-5">
                  <Input
                    id="verify-email"
                    type="email"
                    label="Email address"
                    value={email}
                    disabled
                    icon={<Mail className="w-4 h-4" />}
                    className="bg-gray-50 dark:bg-gray-900/50"
                  />

                  <Select
                    id="department"
                    name="department"
                    label="Department"
                    options={departmentOptions}
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department) setErrors({ ...errors, department: '' });
                    }}
                    error={errors.department}
                  />

                  <Select
                    id="semester"
                    name="semester"
                    label="Semester"
                    options={semesterOptions}
                    value={semester}
                    onChange={(e) => {
                      setSemester(e.target.value);
                      if (errors.semester) setErrors({ ...errors, semester: '' });
                    }}
                    error={errors.semester}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep('email')}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      isLoading={isLoading}
                    >
                      Verify identity
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <div>
              <div className="mb-8">
                <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-5">
                  <Lock className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Set new password
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Choose a strong password for your account
                </p>
              </div>

              <Card className="p-8 shadow-lg shadow-gray-200/50 dark:shadow-none dark:border-gray-800">
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      label="New password"
                      placeholder="Create a new password"
                      icon={<Lock className="w-4 h-4" />}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      error={errors.newPassword}
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
                      placeholder="Re-enter your new password"
                      icon={<Lock className="w-4 h-4" />}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
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

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep('verify')}
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      isLoading={isLoading}
                      icon={!isLoading ? <KeyRound className="w-4 h-4" /> : undefined}
                    >
                      Reset password
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                Password reset!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Your password has been updated successfully. You can now sign in with your new credentials.
              </p>
              <Link to="/login">
                <Button size="lg" className="min-w-[200px]">
                  Sign in to your account
                </Button>
              </Link>
            </div>
          )}

          {/* Back to Login */}
          {step !== 'success' && (
            <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 inline-flex items-center gap-1 group transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
