import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase,
  Settings,
  Edit3,
  Calendar,
  DollarSign,
  Star,
  MessageCircle,
  Search,
  Clock,
  Monitor,
  Building,
  Globe,
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
  TrendingUp,
  FileText
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  HomeMaintenance: { name: 'Home Maintenance', icon: <Settings className="w-4 h-4" />, color: 'from-gray-600 to-gray-500' },
  BusinessStrategy: { name: 'Business Strategy', icon: <Target className="w-4 h-4" />, color: 'from-emerald-500 to-green-500' },
  Marketing: { name: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: 'from-orange-500 to-red-500' },
  LegalServices: { name: 'Legal Services', icon: <Scale className="w-4 h-4" />, color: 'from-slate-600 to-gray-600' },
  FinancialPlanning: { name: 'Financial Planning', icon: <Calculator className="w-4 h-4" />, color: 'from-green-600 to-emerald-600' }
};

const workTypeIcons = {
  Remote: { icon: <Monitor className="w-4 h-4" />, label: "Remote" },
  Physical: { icon: <Building className="w-4 h-4" />, label: "On-site" },
  Both: { icon: <Globe className="w-4 h-4" />, label: "Hybrid" }
};

const ServiceProviderProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const providerData = formData ? {
    name: formData.name,
    email: formData.email,
    location: formData.location,
    workType: formData.workType,
    skillCategories: formData.skillCategories,
    userType: 'ServiceProvider',
    joinedDate: "2024-12-10", 
    profileImage: null,
    title: "Full-Stack Developer & Blockchain Expert", 
    bio: "Experienced full-stack developer with 8+ years building scalable web applications and blockchain solutions. Passionate about creating innovative digital products that solve real-world problems.",
    hourlyRate: 85,
    totalJobsCompleted: 0, 
    activeJobs: 0, 
    totalEarned: 0, 
    averageRating: 0, 
    responseTime: "N/A", 
    completionRate: 100, 
    memberSince: "December 2024" 
  } : null;

  if (!providerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error loading profile or profile not found.</p>
        <button onClick={() => navigate('/onboarding')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Go to Onboarding
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-8 sticky top-24">
              <div className="text-center space-y-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    {providerData.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{providerData.name}</h2>
                  <p className="text-gray-600">{providerData.title}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{providerData.averageRating}</span>
                    <span className="text-xs text-gray-500">({providerData.totalJobsCompleted} reviews)</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{providerData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{providerData.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    {workTypeIcons[providerData.workType as keyof typeof workTypeIcons].icon}
                    <span className="text-sm">{workTypeIcons[providerData.workType as keyof typeof workTypeIcons].label}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{formatCurrency(providerData.hourlyRate)}/hour</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member since {providerData.memberSince}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{providerData.totalJobsCompleted}</div>
                    <div className="text-xs text-gray-500">Jobs Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(providerData.totalEarned)}</div>
                    <div className="text-xs text-gray-500">Total Earned</div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate('/browse-jobs')}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Browse Jobs
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Tab Navigation */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/50">
              <div className="flex space-x-1">
                {[
                  { id: 'overview', name: 'Overview', icon: <User className="w-4 h-4" /> },
                  { id: 'jobs', name: 'My Jobs', icon: <Briefcase className="w-4 h-4" /> },
                  { id: 'proposals', name: 'Proposals', icon: <FileText className="w-4 h-4" /> },
                  { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Jobs</p>
                        <p className="text-3xl font-bold text-blue-600">{providerData.activeJobs}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-3xl font-bold text-green-600">{providerData.completionRate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Rating</p>
                        <p className="text-3xl font-bold text-yellow-600">{providerData.averageRating}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="text-3xl font-bold text-purple-600">{providerData.responseTime}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-3">
                    {providerData.skillCategories.map((skillId: string) => {
                      const skill = skillCategories[skillId as keyof typeof skillCategories];
                      return (
                        <div key={skillId} className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-xl border border-gray-200">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}>
                            {skill.icon}
                          </div>
                          <span className="font-medium text-gray-700">{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">About</h3>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{providerData.bio}</p>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
                  <div className="space-y-6">
                    {/* Recent reviews content here */}
                  </div>
                </div>
              </div>
            )}
            {/* Other tabs content will be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
