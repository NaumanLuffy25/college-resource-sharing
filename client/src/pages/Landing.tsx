import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Upload,
  Search,
  Users,
  Star,
  BookOpen,
  FileText,
  Download,
  Shield,
  Zap,
  ChevronRight,
  Mail,
  Heart,
} from 'lucide-react';
import { Button, Card } from '../components/ui';

const features = [
  {
    icon: Upload,
    title: 'Upload Resources',
    description:
      'Share your notes, assignments, and study materials with fellow students. Support for all file formats.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Search,
    title: 'Discover & Explore',
    description:
      'Find exactly what you need with smart search, filters, and AI-powered recommendations.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description:
      'Connect with peers, organize resources into collections, and build a knowledge base together.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Star,
    title: 'Rate & Review',
    description:
      'Help others find the best resources by rating and reviewing study materials.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Sign up with your college email to join your campus community.',
  },
  {
    number: '02',
    title: 'Upload & Share',
    description: 'Upload your study materials, notes, and resources to share with peers.',
  },
  {
    number: '03',
    title: 'Discover & Download',
    description: 'Browse, search, and download resources shared by other students.',
  },
  {
    number: '04',
    title: 'Rate & Improve',
    description: 'Rate resources to help others find the best study materials.',
  },
];

const stats = [
  { value: '10K+', label: 'Resources Shared' },
  { value: '5K+', label: 'Students' },
  { value: '50K+', label: 'Downloads' },
  { value: '200+', label: 'Departments' },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-50">CollegeHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900" />
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-400">
              <Zap size={14} />
              Built for students, by students
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
              Your Campus{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Resource Hub
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Share lecture notes, assignments, question papers, and study materials with your
              college community. Access thousands of resources shared by students just like you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight size={18} />}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="secondary" size="lg" icon={<Search size={18} />}>
                  Browse Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              A complete platform for sharing and discovering academic resources
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} hover className="group text-center">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 px-4 py-24 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Get started in four simple steps
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4 text-5xl font-bold text-primary-200 dark:text-primary-900">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-16 shadow-2xl sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to boost your studies?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-100">
              Join thousands of students sharing knowledge. Upload your first resource today and help
              your campus community grow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50"
                  icon={<ArrowRight size={18} />}
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/browse">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                  <BookOpen size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  CollegeHub
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The open platform for college resource sharing. Built to help students learn better
                together.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link to="/browse" className="hover:text-primary-600 transition-colors">
                    Browse Resources
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="hover:text-primary-600 transition-colors">
                    Upload
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="hover:text-primary-600 transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Account
              </h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link to="/register" className="hover:text-primary-600 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-600 transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-primary-600 transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} CollegeHub. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
              Made with <Heart size={14} className="mx-1 text-red-500" /> for students
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
