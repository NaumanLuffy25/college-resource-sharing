import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  CloudUpload,
} from 'lucide-react';
import { resourceAPI } from '../api';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Textarea } from '../components/ui';
import { formatFileSize } from '../utils';

const DEPARTMENTS = [
  { value: '', label: 'Select Department' },
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Civil', label: 'Civil' },
];

const SEMESTERS = [
  { value: '', label: 'Select Semester' },
  ...Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Semester ${i + 1}`,
  })),
];

const RESOURCE_TYPES = [
  { value: '', label: 'Select Type' },
  { value: 'notes', label: 'Notes' },
  { value: 'lab', label: 'Lab Files' },
  { value: 'assignment', label: 'Assignments' },
  { value: 'question_paper', label: 'Question Papers' },
  { value: 'project_report', label: 'Project Reports' },
  { value: 'study_material', label: 'Study Materials' },
  { value: 'presentation', label: 'Presentations' },
  { value: 'mini_project', label: 'Mini Projects' },
];

const getFileTypeLabel = (type: string) => {
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('docx')) return 'Word';
  if (type.includes('presentation') || type.includes('pptx')) return 'PowerPoint';
  if (type.includes('zip')) return 'Archive';
  if (type.includes('image')) return 'Image';
  return type.split('/').pop()?.toUpperCase() || 'File';
};

const UploadResource: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !department || !semester || !subject || !resourceType) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('department', department);
      formData.append('semester', semester);
      formData.append('subject', subject);
      formData.append('resourceType', resourceType);
      formData.append('author', author);
      if (tags) {
        tags.split(',').map((t) => t.trim()).filter(Boolean).forEach((tag) => {
          formData.append('tags', tag);
        });
      }

      const res = await resourceAPI.upload(formData);
      const resourceId = res.data.data?._id || res.data.resource?._id;
      if (resourceId) {
        navigate(`/resources/${resourceId}`);
      } else {
        navigate('/resources');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Resource</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Share study materials with your peers.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5 text-primary-500" />
                File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.pptx,.zip,.png,.jpg,.jpeg,.txt,.csv,.xls,.xlsx"
              />

              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                    dragActive
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    PDF, Word, PowerPoint, ZIP, Images up to 50MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getFileTypeLabel(file.type)} &middot; {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <Input
                  id="title"
                  label="Title *"
                  placeholder="e.g. Data Structures - Unit 1 Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <Textarea
                  id="description"
                  label="Description"
                  placeholder="Describe your resource, what it covers, key topics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    id="department"
                    label="Department *"
                    options={DEPARTMENTS}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                  <Select
                    id="semester"
                    label="Semester *"
                    options={SEMESTERS}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="subject"
                    label="Subject *"
                    placeholder="e.g. Data Structures & Algorithms"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  <Select
                    id="resourceType"
                    label="Resource Type *"
                    options={RESOURCE_TYPES}
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="author"
                    label="Author Name"
                    placeholder="Your name or group name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                  <Input
                    id="tags"
                    label="Tags"
                    placeholder="e.g. data structures, algorithms, trees"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Separate tags with commas.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={uploading}
              disabled={!file || !title || !department || !semester || !subject || !resourceType}
              icon={<Upload className="h-5 w-5" />}
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
