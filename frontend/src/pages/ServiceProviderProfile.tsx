import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase,
  Settings,
  Edit3,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Star,
  Heart,
  MessageCircle,
  Filter,
  Search,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
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
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const providerData = {
  name: "jaja",
  email: "jaja@gmail.com",
  location: "lagos",
  workType: "Both",
  userType: "ServiceProvider",
  skillCategories: ["Teacher", "Electrical", "HomeMaintenance", "DevOps", "Plumbing"],
  joinedDate: "2025-08-21",
  profileImage: null,
  title: "Full-Time Teacher & HomeMaintenance Expert",
  bio: "Experienced full-time teacher with 8+ years of experience in Biology and Home maintenance solutions. Passionate about creating innovative digital products that solve real-world problems, also making the world grow.",
  hourlyRate: 85,
  totalJobsCompleted: 0,
  activeJobs: 0,
  totalEarned: 0,
  averageRating: 9,
  responseTime: "2 hours",
  completionRate: 0,
  memberSince: "August 2025"
};

// Sample jobs data for service provider
const jobsData = [
  {
    id: 1,
    title: "E-commerce Platform Development",
    description: "Building a complete e-commerce solution with React, Node.js, and payment integration...",
    budget: 5000,
    deadline: "2025-02-28",
    status: "InProgress",
    client: "TechStartup Inc.",
    startDate: "2025-01-15",
    progress: 65,
    skills: ["WebDevelopment", "UIUXDesign"]
  },
  {
    id: 2,
    title: "Mobile App Backend API",
    description: "Developing RESTful APIs for a mobile fitness tracking application...",
    budget: 3500,
    deadline: "2025-02-15",
    status: "InProgress",
    client: "FitLife Corp",
    startDate: "2025-01-10",
    progress: 40,
    skills: ["MobileDevelopment", "DevOps"]
  },
  {
    id: 3,
    title: "Smart Contract Development",
    description: "Created secure smart contracts for DeFi lending protocol...",
    budget: 4500,
    deadline: "2025-01-20",
    status: "Completed",
    client: "DeFi Solutions",
    startDate: "2024-12-20",
    progress: 100,
    skills: ["BlockchainDev"],
    rating: 5,
    feedback: "Excellent work! The smart contracts were delivered on time and passed all security audits."
  },
  {
    id: 4,
    title: "React Dashboard Design",
    description: "Complete admin dashboard redesign with modern UI/UX principles...",
    budget: 2800,
    deadline: "2025-01-30",
    status: "Completed",
    client: "DataViz Inc",
    startDate: "2025-01-05",
    progress: 100,
    skills: ["UIUXDesign", "WebDevelopment"],
    rating: 5,
    feedback: "Amazing design and implementation. The dashboard looks fantastic!"
  }
];

// Sample proposals/applications
const proposalsData = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    client: "Analytics Pro",
    budget: 6000,
    proposalAmount: 5500,
    submittedDate: "2025-01-18",
    status: "pending",
    skills: ["WebDevelopment", "DataScience"]
  },
  {
    id: 2,
    title: "Blockchain Voting System",
    client: "GovTech Solutions",
    budget: 8000,
    proposalAmount: 7500,
    submittedDate: "2025-01-16",
    status: "shortlisted",
    skills: ["BlockchainDev", "WebDevelopment"]
  }
];

// Skill categories mapping
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'InProgress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Funded': return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'shortlisted': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
                    {providerData.name.split(' ').map(n => n[0]).join('')}
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
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
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
                    {providerData.skillCategories.map((skillId) => {
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
                    {jobsData.filter(job => job.status === 'Completed' && job.feedback).map((job) => (
                      <div key={job.id} className="border-l-4 border-green-500 pl-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(job.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900">{job.client}</span>
                          <span className="text-sm text-gray-500">• {job.title}</span>
                        </div>
                        <p className="text-gray-600 italic">"{job.feedback}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                
                {/* Jobs Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl hover:bg-white transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {jobsData.map((job) => (
                    <div key={job.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            {getJobStatusIcon(job.status)}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              job.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                              job.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {job.status === 'InProgress' ? 'In Progress' : job.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          
                          {/* Progress Bar for Active Jobs */}
                          {job.status === 'InProgress' && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{job.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Job Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills.map((skillId) => {
                              const skill = skillCategories[skillId as keyof typeof skillCategories];
                              return (
                                <span key={skillId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                  {skill.name}
                                </span>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(job.budget)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Due {formatDate(job.deadline)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{job.client}</span>
                            </div>
                          </div>

                          {/* Rating for completed jobs */}
                          {job.status === 'Completed' && job.rating && (
                            <div className="mt-3 flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(job.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">Client Rating</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals Tab */}
            {activeTab === 'proposals' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">My Proposals</h2>
                
                <div className="space-y-4">
                  {proposalsData.map((proposal) => (
                    <div key={proposal.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{proposal.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProposalStatusColor(proposal.status)}`}>
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </div>
                          
                          {/* Proposal Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {proposal.skills.map((skillId) => {
                              const skill = skillCategories[skillId as keyof typeof skillCategories];
                              return (
                                <span key={skillId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                  {skill.name}
                                </span>
                              );
                            })}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Budget: {formatCurrency(proposal.budget)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4" />
                              <span>My Bid: {formatCurrency(proposal.proposalAmount)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Submitted {formatDate(proposal.submittedDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{proposal.client}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                
                {/* Profile Settings */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={providerData.name}
                          className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={providerData.email}
                          className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                        <input
                          type="text"
                          value={providerData.title}
                          className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="number"
                            value={providerData.hourlyRate}
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={providerData.location}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Work Type Preference</label>
                      <select className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="Remote">Remote Only</option>
                        <option value="Physical">On-site Only</option>
                        <option value="Both">Both Remote & On-site</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                      <textarea
                        value={providerData.bio}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Skills & Expertise</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(skillCategories).map(([skillId, skill]) => (
                          <label key={skillId} className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={providerData.skillCategories.includes(skillId)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center text-white text-xs`}>
                              {skill.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                        Cancel
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Portfolio Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Portfolio & Certifications</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                      <input
                        type="url"
                        placeholder="https://your-portfolio.com"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">Certifications</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                          <div>
                            <h4 className="font-medium text-gray-900">AWS Solutions Architect</h4>
                            <p className="text-sm text-gray-600">Amazon Web Services • Valid until Dec 2025</p>
                          </div>
                          <button className="text-red-600 hover:text-red-700">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                          <div>
                            <h4 className="font-medium text-gray-900">Certified Blockchain Developer</h4>
                            <p className="text-sm text-gray-600">Blockchain Council • Valid until Mar 2026</p>
                          </div>
                          <button className="text-red-600 hover:text-red-700">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Certification
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'new_jobs', label: 'New job opportunities', description: 'Get notified about jobs matching your skills' },
                      { id: 'messages', label: 'New messages', description: 'Get notified about new messages from clients' },
                      { id: 'job_updates', label: 'Job updates', description: 'Updates about your active jobs and deadlines' },
                      { id: 'payment_updates', label: 'Payment notifications', description: 'Notifications about payments and escrow releases' },
                      { id: 'rating_reviews', label: 'Reviews and ratings', description: 'When clients leave feedback on your work' },
                      { id: 'marketing', label: 'Tips and updates', description: 'Platform updates and freelancing tips' }
                    ].map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.label}</h4>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Privacy & Security</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Control who can see your profile information</p>
                      </div>
                      <select className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option>Public</option>
                        <option>Clients Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Show Online Status</h4>
                        <p className="text-sm text-gray-600">Let clients see when you're online</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Show Earnings</h4>
                        <p className="text-sm text-gray-600">Display total earnings on your profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button className="text-red-600 hover:text-red-700 font-medium">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-500 mt-1">Permanently remove your account and all data</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;