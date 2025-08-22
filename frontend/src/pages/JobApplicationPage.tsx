import React, { useState } from 'react';
import { 
  ArrowLeft,
  DollarSign, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Briefcase,
  Send,
  Wallet,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  Paperclip,
  Eye,
  Heart,
  BookmarkPlus,
  Share2,
  Flag,
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
  Settings,
  Target,
  Megaphone,
  Scale,
  Calculator,
  Award,
  CreditCard,
  ShieldCheck,
  Info
} from 'lucide-react';

// Mock job data
const jobData = {
  id: 1,
  title: "Full-Stack E-commerce Platform Development",
  company: "TechVenture Solutions",
  companyLogo: null,
  companyRating: 4.8,
  companyReviews: 127,
  location: "Remote",
  workType: "Remote",
  budget: { min: 3500, max: 5500 },
  budgetType: "fixed",
  duration: "2-3 months",
  experience: "Intermediate to Expert",
  postedDate: "2025-01-18",
  deadline: "2025-02-05",
  proposals: 12,
  interviewing: 3,
  hires: 0,
  description: `We are looking for an experienced full-stack developer to build a comprehensive e-commerce platform from scratch. This project involves creating a modern, scalable web application with advanced features including user authentication, product catalog, shopping cart, payment processing, and admin dashboard.

Key Requirements:
• Frontend: React.js/Next.js with TypeScript
• Backend: Node.js with Express or NestJS  
• Database: PostgreSQL or MongoDB
• Payment Integration: Stripe, PayPal
• Authentication: JWT or OAuth
• Deployment: AWS/Vercel/Digital Ocean

The ideal candidate should have:
- 3+ years of full-stack development experience
- Strong knowledge of modern web technologies
- Experience with e-commerce platforms
- Understanding of payment gateway integrations
- Knowledge of SEO best practices
- Experience with responsive design

This is a great opportunity to work on a high-impact project with a fast-growing startup. We value quality, attention to detail, and clear communication.`,
  
  skills: ["WebDevelopment", "UIUXDesign", "DevOps", "DataScience"],
  
  clientInfo: {
    name: "King Johnson",
    title: "CTO",
    memberSince: "2025",
    location: "Lagos",
    timezone: "PST (UTC-8)",
    jobsPosted: 0,
    hireRate: 0,
    totalSpent: 0,
    avgRating: 4.9,
    preferredPayment: "Crypto (USDC, ETH)",
    verificationStatus: "Verified"
  },

  paymentOptions: {
    crypto: true,
    fiat: true,
    preferredCrypto: ["USDC", "ETH", "BTC"],
    escrowProtection: true
  }
};

// Skill categories mapping (reusing from profile)
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

const JobApplicationPage: React.FC = () => {
  const [proposal, setProposal] = useState({
    coverLetter: '',
    bidAmount: '',
    timeline: '',
    walletAddress: '',
    attachments: [] as File[]
  });

  const [activeSection, setActiveSection] = useState('overview');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState('');
  const [showWalletInfo, setShowWalletInfo] = useState(false);

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

  const handleWalletConnect = (walletType: string) => {
    setSelectedWalletType(walletType);
    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setProposal(prev => ({
        ...prev,
        walletAddress: walletType === 'metamask' ? '0x742d35Cc6634C0532925a3b8D1A42Bff95b8Ad12' : 
                       walletType === 'walletconnect' ? '0x8ba1f109551bD432803012645Hac136c74a5fA1B' :
                       'TYDzsYUEpvnYmQk4zGP6VQonKVGiGD8DwZ'
      }));
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setProposal(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setProposal(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const copyWalletAddress = () => {
    if (proposal.walletAddress) {
      navigator.clipboard.writeText(proposal.walletAddress);
    }
  };

  const handleSubmit = () => {
    if (!proposal.coverLetter || !proposal.bidAmount || !proposal.walletAddress) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Proposal submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Jobs</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <BookmarkPlus className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Flag className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Job Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{jobData.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>{jobData.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{jobData.companyRating}</span>
                      <span className="text-sm">({jobData.companyReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{jobData.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatCurrency(jobData.budget.min)} - {formatCurrency(jobData.budget.max)}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{jobData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg">
                      <Award className="w-4 h-4" />
                      <span>{jobData.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg">
                      <Bitcoin className="w-4 h-4" />
                      <span>Crypto Payments Accepted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{jobData.proposals}</div>
                  <div className="text-xs text-gray-500">Proposals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{jobData.interviewing}</div>
                  <div className="text-xs text-gray-500">Interviewing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{jobData.hires}</div>
                  <div className="text-xs text-gray-500">Hired</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2 days</div>
                  <div className="text-xs text-gray-500">Left to apply</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/50">
              <div className="flex space-x-1">
                {[
                  { id: 'overview', name: 'Job Details' },
                  { id: 'client', name: 'About Client' },
                  { id: 'apply', name: 'Submit Proposal' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeSection === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Details */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{jobData.description}</p>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Required Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {jobData.skills.map((skillId) => {
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

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Options</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900">Traditional Payment</h4>
                      </div>
                      <p className="text-gray-600 text-sm">Bank transfers, PayPal, Stripe</p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                          <Bitcoin className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900">Cryptocurrency</h4>
                      </div>
                      <div className="flex space-x-2">
                        {jobData.paymentOptions.preferredCrypto.map((crypto) => (
                          <span key={crypto} className="px-2 py-1 bg-orange-200 text-orange-800 rounded-lg text-xs font-medium">
                            {crypto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Client */}
            {activeSection === 'client' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">About the Client</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                        {jobData.clientInfo.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{jobData.clientInfo.name}</h4>
                        <p className="text-gray-600">{jobData.clientInfo.title}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">{jobData.clientInfo.verificationStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">{jobData.clientInfo.memberSince}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{jobData.clientInfo.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-medium">{jobData.clientInfo.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Payment:</span>
                        <span className="font-medium">{jobData.clientInfo.preferredPayment}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50/50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{jobData.clientInfo.jobsPosted}</div>
                      <div className="text-sm text-gray-600">Jobs Posted</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 rounded-2xl">
                      <div className="text-2xl font-bold text-green-600">{jobData.clientInfo.hireRate}%</div>
                      <div className="text-sm text-gray-600">Hire Rate</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 rounded-2xl">
                      <div className="text-2xl font-bold text-purple-600">{formatCurrency(jobData.clientInfo.totalSpent)}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <div className="text-2xl font-bold text-yellow-600">{jobData.clientInfo.avgRating}</div>
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Proposal */}
            {activeSection === 'apply' && (
              <div className="space-y-8">
                
                {/* Wallet Connection */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Connect Your Wallet</h3>
                    <button
                      onClick={() => setShowWalletInfo(!showWalletInfo)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {showWalletInfo && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Why connect a wallet?</h4>
                          <p className="text-sm text-blue-700">
                            This client prefers cryptocurrency payments. By connecting your wallet, you can receive payments directly in USDC, ETH, or BTC with faster processing times and lower fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isWalletConnected ? (
                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleWalletConnect('metamask')}
                        className="p-6 border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">MetaMask</h4>
                        <p className="text-sm text-gray-600">Most popular web3 wallet</p>
                      </button>
                      
                      <button
                        onClick={() => handleWalletConnect('walletconnect')}
                        className="p-6 border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">WalletConnect</h4>
                        <p className="text-sm text-gray-600">Connect any mobile wallet</p>
                      </button>
                      
                      <button
                        onClick={() => handleWalletConnect('manual')}
                        className="p-6 border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">Manual Entry</h4>
                        <p className="text-sm text-gray-600">Enter wallet address manually</p>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <h4 className="font-bold text-green-900">Wallet Connected</h4>
                            <p className="text-sm text-green-700">Ready to receive crypto payments</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-3 py-1 bg-white rounded-lg text-sm font-mono">
                            {proposal.walletAddress.slice(0, 6)}...{proposal.walletAddress.slice(-4)}
                          </code>
                          <button
                            onClick={copyWalletAddress}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proposal Form */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Your Proposal</h3>
                  
                  <div className="space-y-6">
                    {/* Cover Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter *
                      </label>
                      <textarea
                        value={proposal.coverLetter}
                        onChange={(e) => setProposal(prev => ({ ...prev, coverLetter: e.target.value }))}
                        placeholder="Explain why you're the perfect fit for this project. Mention relevant experience, your approach, and any questions about the requirements..."
                        rows={8}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 100 characters</p>
                    </div>

                    {/* Bid Amount */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Bid Amount *
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="number"
                            value={proposal.bidAmount}
                            onChange={(e) => setProposal(prev => ({ ...prev, bidAmount: e.target.value }))}
                            placeholder="3500"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Budget range: {formatCurrency(jobData.budget.min)} - {formatCurrency(jobData.budget.max)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Timeline *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <select
                            value={proposal.timeline}
                            onChange={(e) => setProposal(prev => ({ ...prev, timeline: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select timeline</option>
                            <option value="1-2 weeks">1-2 weeks</option>
                            <option value="2-4 weeks">2-4 weeks</option>
                            <option value="1-2 months">1-2 months</option>
                            <option value="2-3 months">2-3 months</option>
                            <option value="3+ months">3+ months</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Address (if not connected) */}
                    {!isWalletConnected && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Wallet Address (Optional)
                        </label>
                        <div className="relative">
                          <Wallet className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            value={proposal.walletAddress}
                            onChange={(e) => setProposal(prev => ({ ...prev, walletAddress: e.target.value }))}
                            placeholder="0x742d35Cc6634C0532925a3b8D1A42Bff95b8Ad12"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Provide your crypto wallet address for receiving payments in USDC, ETH, or BTC
                        </p>
                      </div>
                    )}

                    {/* File Attachments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attachments (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Upload portfolio samples, resume, or relevant documents</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, DOC, TXT, JPG, PNG up to 10MB each</p>
                        </label>
                      </div>

                      {/* Uploaded Files */}
                      {proposal.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {proposal.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                              </div>
                              <button
                                onClick={() => removeAttachment(index)}
                                className="text-red-600 hover:text-red-700 p-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Terms Agreement */}
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                          I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</a> and understand that:
                          <ul className="mt-2 space-y-1 text-xs text-gray-600">
                            <li>• Payments will be held in escrow until project completion</li>
                            <li>• Cryptocurrency payments are subject to network fees</li>
                            <li>• All communications should be conducted through the platform</li>
                            <li>• I will deliver work according to the agreed timeline</li>
                          </ul>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">
                        Save Draft
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              
              {/* Quick Apply Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4">Quick Apply</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{formatCurrency(jobData.budget.min)} - {formatCurrency(jobData.budget.max)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{jobData.duration}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{jobData.experience}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-medium">{formatDate(jobData.postedDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium text-red-600">{formatDate(jobData.deadline)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-green-600 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Escrow Protection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-600 mb-2">
                    <Bitcoin className="w-4 h-4" />
                    <span>Crypto Payments Supported</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-purple-600">
                    <Star className="w-4 h-4" />
                    <span>Premium Client</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection('apply')}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Apply Now
                </button>
              </div>

              {/* Similar Jobs */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <h3 className="font-bold text-gray-900 mb-4">Similar Jobs</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "React Dashboard Development",
                      budget: "2500-4000",
                      skills: ["WebDevelopment", "UIUXDesign"],
                      proposals: 8
                    },
                    {
                      title: "Mobile App Backend API",
                      budget: "3000-5000",
                      skills: ["MobileDevelopment", "DevOps"],
                      proposals: 15
                    },
                    {
                      title: "Blockchain Smart Contracts",
                      budget: "4000-6000",
                      skills: ["BlockchainDev", "WebDevelopment"],
                      proposals: 6
                    }
                  ].map((job, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">{job.title}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-green-600 font-medium">${job.budget}</span>
                        <span className="text-xs text-gray-500">{job.proposals} proposals</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((skillId) => {
                          const skill = skillCategories[skillId as keyof typeof skillCategories];
                          return (
                            <span key={skillId} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {skill.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-indigo-600 hover:text-indigo-700 font-medium py-2 text-sm">
                  View All Similar Jobs
                </button>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900">Pro Tips</h3>
                </div>
                
                <div className="space-y-3 text-sm text-green-800">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p>Mention specific technologies and your experience with them</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p>Include relevant portfolio samples or case studies</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p>Ask clarifying questions to show engagement</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p>Connecting your wallet shows you're crypto-ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;