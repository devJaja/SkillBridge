import React, { useState } from 'react';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Users,
  FileText,
  Image,
  Paperclip,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Code,
  Smartphone,
  BarChart3,
  Bitcoin,
  Server,
  Palette,
  PenTool,
  Video,
  Layers,
  Home,
  Zap,
  Wrench,
  Target,
  Megaphone,
  Scale,
  Calculator,
  Monitor,
  Building,
  Globe,
  Lightbulb,
  Star,
  Eye
} from 'lucide-react';

// Skill categories mapping (same as client profile)
const skillCategories = {
  WebDevelopment: { name: 'Web Development', icon: <Code className="w-4 h-4" />, color: 'from-blue-500 to-cyan-500' },
  MobileDevelopment: { name: 'Mobile Development', icon: <Smartphone className="w-4 h-4" />, color: 'from-green-500 to-emerald-500' },
  DataScience: { name: 'Data Science', icon: <BarChart3 className="w-4 h-4" />, color: 'from-purple-500 to-indigo-500' },
  BlockchainDev: { name: 'Blockchain Development', icon: <Bitcoin className="w-4 h-4" />, color: 'from-yellow-500 to-orange-500' },
  DevOps: { name: 'DevOps', icon: <Server className="w-4 h-4" />, color: 'from-gray-500 to-slate-500' },
  GraphicDesign: { name: 'Graphic Design', icon: <Palette className="w-4 h-4" />, color: 'from-pink-500 to-rose-500' },
  ContentWriting: { name: 'Content Writing', icon: <PenTool className="w-4 h-4" />, color: 'from-teal-500 to-cyan-500' },
  VideoEditing: { name: 'Video Editing', icon: <Video className="w-4 h-4" />, color: 'from-red-500 to-pink-500' },
  UIUXDesign: { name: 'UI/UX Design', icon: <Layers className="w-4 h-4" />, color: 'from-indigo-500 to-purple-500' },
  Construction: { name: 'Construction', icon: <Home className="w-4 h-4" />, color: 'from-amber-500 to-orange-500' },
  Electrical: { name: 'Electrical', icon: <Zap className="w-4 h-4" />, color: 'from-yellow-400 to-yellow-500' },
  Plumbing: { name: 'Plumbing', icon: <Wrench className="w-4 h-4" />, color: 'from-blue-600 to-blue-500' },
  HomeMaintenance: { name: 'Home Maintenance', icon: <Wrench className="w-4 h-4" />, color: 'from-gray-600 to-gray-500' },
  BusinessStrategy: { name: 'Business Strategy', icon: <Target className="w-4 h-4" />, color: 'from-emerald-500 to-green-500' },
  Marketing: { name: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: 'from-orange-500 to-red-500' },
  LegalServices: { name: 'Legal Services', icon: <Scale className="w-4 h-4" />, color: 'from-slate-600 to-gray-600' },
  FinancialPlanning: { name: 'Financial Planning', icon: <Calculator className="w-4 h-4" />, color: 'from-green-600 to-emerald-600' }
};

const workTypeOptions = [
  { value: 'Remote', label: 'Remote', icon: <Monitor className="w-4 h-4" /> },
  { value: 'Physical', label: 'On-site', icon: <Building className="w-4 h-4" /> },
  { value: 'Both', label: 'Hybrid', icon: <Globe className="w-4 h-4" /> }
];

const JobPostPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    workType: 'Remote',
    location: '',
    skillCategories: [] as string[],
    requirements: [''],
    deliverables: [''],
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addListItem = (field: 'requirements' | 'deliverables') => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'requirements' | 'deliverables', index: number, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'requirements' | 'deliverables', index: number) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleSkillCategory = (skillId: string) => {
    setJobData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.includes(skillId)
        ? prev.skillCategories.filter(id => id !== skillId)
        : [...prev.skillCategories, skillId]
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!jobData.title.trim()) newErrors.title = 'Job title is required';
      if (!jobData.description.trim()) newErrors.description = 'Job description is required';
      if (jobData.skillCategories.length === 0) newErrors.skillCategories = 'Select at least one skill category';
    }
    
    if (step === 2) {
      if (!jobData.budget || parseFloat(jobData.budget) <= 0) newErrors.budget = 'Valid budget is required';
      if (!jobData.deadline) newErrors.deadline = 'Deadline is required';
      if (new Date(jobData.deadline) <= new Date()) newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Here you would integrate with the smart contract
      console.log('Submitting job:', jobData);
      // Call fundJob function from the smart contract
      alert('Job posted successfully! (This would call the smart contract)');
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Post a New Job</h1>
                <p className="text-sm text-gray-600">Find the perfect service provider for your project</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-2 mx-4 rounded-full ${
                    step < currentStep ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-indigo-600' : 'text-gray-500'}>Job Details</span>
            <span className={currentStep >= 2 ? 'text-indigo-600' : 'text-gray-500'}>Budget & Timeline</span>
            <span className={currentStep >= 3 ? 'text-indigo-600' : 'text-gray-500'}>Review & Post</span>
          </div>
        </div>

        {!isPreview ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
            
            {/* Step 1: Job Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your project</h2>
                  <p className="text-gray-600">The more details you provide, the better proposals you'll receive</p>
                </div>

                <div className="space-y-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={jobData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Build a modern e-commerce website"
                      className={`w-full px-4 py-3 bg-white/70 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.title ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      value={jobData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your project in detail. What are you looking to achieve? What's the scope of work?"
                      rows={6}
                      className={`w-full px-4 py-3 bg-white/70 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Skill Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Required Skills *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(skillCategories).map(([skillId, skill]) => (
                        <label key={skillId} className={`flex items-center space-x-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                          jobData.skillCategories.includes(skillId)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white/70 hover:bg-white'
                        }`}>
                          <input
                            type="checkbox"
                            checked={jobData.skillCategories.includes(skillId)}
                            onChange={() => toggleSkillCategory(skillId)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white text-xs`}>
                            {skill.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        </label>
                      ))}
                    </div>
                    {errors.skillCategories && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.skillCategories}
                      </p>
                    )}
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Work Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {workTypeOptions.map((option) => (
                        <label key={option.value} className={`flex items-center justify-center space-x-2 p-4 rounded-2xl border cursor-pointer transition-all ${
                          jobData.workType === option.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 bg-white/70 hover:bg-white'
                        }`}>
                          <input
                            type="radio"
                            name="workType"
                            value={option.value}
                            checked={jobData.workType === option.value}
                            onChange={(e) => handleInputChange('workType', e.target.value)}
                            className="sr-only"
                          />
                          {option.icon}
                          <span className="font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  {(jobData.workType === 'Physical' || jobData.workType === 'Both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={jobData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., San Francisco, CA or Remote"
                          className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget and Timeline</h2>
                  <p className="text-gray-600">Set your budget and deadline for the project</p>
                </div>

                <div className="space-y-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Budget (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="number"
                        value={jobData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="5000"
                        min="0"
                        step="100"
                        className={`w-full pl-12 pr-4 py-3 bg-white/70 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.budget ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.budget}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      This amount will be held in escrow until the job is completed
                    </p>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Deadline *
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="date"
                        value={jobData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-12 pr-4 py-3 bg-white/70 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          errors.deadline ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.deadline && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.deadline}
                      </p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Requirements
                    </label>
                    <div className="space-y-3">
                      {jobData.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={requirement} 
                            onChange={(e) => updateListItem('requirements', index, e.target.value)}
                            placeholder={`Requirement ${index + 1}`}
                            className="flex-1 px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          {jobData.requirements.length > 1 && (
                            <button
                              onClick={() => removeListItem('requirements', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem('requirements')}
                        className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Requirement</span>
                      </button>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Deliverables
                    </label>
                    <div className="space-y-3">
                      {jobData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={deliverable}
                            onChange={(e) => updateListItem('deliverables', index, e.target.value)}
                            placeholder={`Deliverable ${index + 1}`}
                            className="flex-1 px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          {jobData.deliverables.length > 1 && (
                            <button
                              onClick={() => removeListItem('deliverables', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem('deliverables')}
                        className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Deliverable</span>
                      </button>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Files (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                      <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                      <p className="text-sm text-gray-400">Supported formats: PDF, DOC, PNG, JPG (Max 10MB each)</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Post */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Job Post</h2>
                  <p className="text-gray-600">Double-check all details before posting</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <div className="flex items-start space-x-4">
                    <Lightbulb className="w-8 h-8 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-indigo-900 mb-2">Smart Contract Integration</h3>
                      <p className="text-indigo-700 text-sm">
                        Your payment will be securely held in an escrow smart contract. The service provider will be paid automatically upon successful completion, or you can approve/reject the work within 7 days of submission.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Project Budget</h3>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <span className="text-3xl font-bold text-green-600">{formatCurrency(jobData.budget)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Held in secure escrow</p>
                    </div>

                    <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-4">Deadline</h3>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <span className="text-lg font-bold text-blue-600">{formatDate(jobData.deadline)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {jobData.deadline && Math.ceil((new Date(jobData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days from now
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Title</h4>
                        <p className="text-gray-900">{jobData.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600">{jobData.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobData.skillCategories.map((skillId) => {
                            const skill = skillCategories[skillId as keyof typeof skillCategories];
                            return (
                              <div key={skillId} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-gray-200">
                                <div className={`w-4 h-4 rounded bg-gradient-to-br ${skill.color} flex items-center justify-center text-white text-xs`}>
                                  {skill.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {jobData.requirements.some(req => req.trim()) && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {jobData.requirements.filter(req => req.trim()).map((req, index) => (
                              <li key={index} className="text-gray-600 text-sm flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {jobData.deliverables.some(del => del.trim()) && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Deliverables</h4>
                          <ul className="space-y-1">
                            {jobData.deliverables.filter(del => del.trim()).map((del, index) => (
                              <li key={index} className="text-gray-600 text-sm flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Payment Terms
                  </h3>
                  <ul className="space-y-2 text-yellow-800 text-sm">
                    <li>• Your payment will be held securely in a blockchain escrow contract</li>
                    <li>• Funds are released when you approve the completed work</li>
                    <li>• If no response is given within 7 days of work submission, payment auto-releases</li>
                    <li>• You can reject work with feedback, but payment still releases after 7 days</li>
                    <li>• If the provider misses the deadline, you get an automatic refund</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Next Step</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Post Job & Fund Escrow</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Preview</h2>
              <p className="text-gray-600">This is how your job post will appear to service providers</p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Job Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                <h1 className="text-3xl font-bold mb-4">{jobData.title || 'Job Title'}</h1>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Budget</p>
                      <p className="font-bold text-lg">{formatCurrency(jobData.budget)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Deadline</p>
                      <p className="font-bold">{formatDate(jobData.deadline) || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {workTypeOptions.find(opt => opt.value === jobData.workType)?.icon}
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Work Type</p>
                      <p className="font-bold">{workTypeOptions.find(opt => opt.value === jobData.workType)?.label}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Content */}
              <div className="space-y-8">
                <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Project Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {jobData.description || 'No description provided yet.'}
                  </p>
                </div>

                {jobData.skillCategories.length > 0 && (
                  <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {jobData.skillCategories.map((skillId) => {
                        const skill = skillCategories[skillId as keyof typeof skillCategories];
                        return (
                          <div key={skillId} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}>
                              {skill.icon}
                            </div>
                            <span className="font-medium text-gray-700">{skill.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {jobData.requirements.some(req => req.trim()) && (
                  <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <div className="space-y-3">
                      {jobData.requirements.filter(req => req.trim()).map((req, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-gray-600">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {jobData.deliverables.some(del => del.trim()) && (
                  <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Expected Deliverables</h3>
                    <div className="space-y-3">
                      {jobData.deliverables.filter(del => del.trim()).map((del, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <span className="text-gray-600">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons for Preview */}
                <div className="bg-white/70 rounded-2xl p-6 border border-gray-200">
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                      Apply for This Job
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                      Save Job
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostPage;