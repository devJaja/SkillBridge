import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Users,
  FileText,
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
  Eye,
  Shield,
  Wallet,
  UserCheck,
  Search,
  Filter,
  ExternalLink,
  Info,
  Lock,
  TrendingUp
} from 'lucide-react';

// Mock data for demonstration
const mockJobListings = [
  {
    id: 1,
    title: "Modern E-commerce Website Development",
    description: "Build a responsive e-commerce platform with React, Node.js, and payment integration. Need modern UI/UX design and mobile optimization.",
    budget: 5000,
    deadline: "2025-10-15",
    client: "0x1234...5678",
    isOpen: true,
    skillCategories: ["WebDevelopment", "UIUXDesign"],
    postedDate: "2025-08-15"
  },
  {
    id: 2,
    title: "Mobile App for Food Delivery",
    description: "Develop a cross-platform mobile application for food delivery with real-time tracking, payment integration, and user-friendly interface.",
    budget: 8000,
    deadline: "2025-11-20",
    client: "0x8765...4321",
    isOpen: true,
    skillCategories: ["MobileDevelopment", "UIUXDesign"],
    postedDate: "2025-08-18"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Create an interactive dashboard for business analytics with charts, real-time data visualization, and reporting features.",
    budget: 3500,
    deadline: "2025-09-30",
    client: "0xABCD...EFGH",
    isOpen: true,
    skillCategories: ["DataScience", "WebDevelopment"],
    postedDate: "2025-08-20"
  }
];

const mockServiceProviders = [
  {
    address: "0x1111...2222",
    name: "Alice Johnson",
    email: "alice@example.com",
    skillCategories: ["WebDevelopment", "UIUXDesign"],
    location: "San Francisco, CA",
    workType: "Remote",
    averageRating: 4.8,
    ratingCount: 25,
    completedJobs: 32
  },
  {
    address: "0x3333...4444",
    name: "Bob Smith",
    email: "bob@example.com",
    skillCategories: ["MobileDevelopment", "BlockchainDev"],
    location: "New York, NY",
    workType: "Both",
    averageRating: 4.6,
    ratingCount: 18,
    completedJobs: 24
  },
  {
    address: "0x5555...6666",
    name: "Carol Davis",
    email: "carol@example.com",
    skillCategories: ["DataScience", "GraphicDesign"],
    location: "Austin, TX",
    workType: "Remote",
    averageRating: 4.9,
    ratingCount: 31,
    completedJobs: 28
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
  HomeMaintenance: { name: 'Home Maintenance', icon: <Wrench className="w-4 h-4" />, color: 'from-gray-600 to-gray-500' },
  BusinessStrategy: { name: 'Business Strategy', icon: <Target className="w-4 h-4" />, color: 'from-emerald-500 to-green-500' },
  Marketing: { name: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: 'from-orange-500 to-red-500' },
  LegalServices: { name: 'Legal Services', icon: <Scale className="w-4 h-4" />, color: 'from-slate-600 to-gray-600' },
  FinancialPlanning: { name: 'Financial Planning', icon: <Calculator className="w-4 h-4" />, color: 'from-green-600 to-emerald-600' }
};

const JobFundingPage = () => {
  const [currentView, setCurrentView] = useState('listings');
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);

  // Funding form state
  const [fundingData, setFundingData] = useState({
    amount: '',
    deadline: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock wallet connection
  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x1234...ABCD');
      setBalance(10.5); // ETH balance
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFundingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateFunding = () => {
    const newErrors = {};
    
    if (!fundingData.amount || parseFloat(fundingData.amount) <= 0) {
      newErrors.amount = 'Valid funding amount is required';
    }
    
    if (parseFloat(fundingData.amount) > balance) {
      newErrors.amount = 'Insufficient balance';
    }
    
    if (!fundingData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(fundingData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    if (!selectedProvider) {
      newErrors.provider = 'Please select a service provider';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFundJob = async () => {
    if (!validateFunding()) return;

    setIsLoading(true);
    
    try {
      // Simulate smart contract interaction
      console.log('Funding job:', {
        listingId: selectedListing?.id,
        provider: selectedProvider?.address,
        amount: fundingData.amount,
        deadline: fundingData.deadline,
        message: fundingData.message
      });

      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert('Job funded successfully! The escrow has been created and the service provider has been notified.');
      
      // Reset form
      setFundingData({ amount: '', deadline: '', message: '' });
      setSelectedListing(null);
      setSelectedProvider(null);
      setCurrentView('listings');
      
    } catch (error) {
      console.error('Funding failed:', error);
      alert('Failed to fund job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredListings = mockJobListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = !filterSkill || listing.skillCategories.includes(filterSkill);
    return matchesSearch && matchesSkill && listing.isOpen;
  });

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = !filterSkill || provider.skillCategories.includes(filterSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => currentView !== 'listings' ? setCurrentView('listings') : null}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fund a Job</h1>
                <p className="text-sm text-gray-600">Secure escrow-based job funding</p>
              </div>
            </div>
            
            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">{walletAddress}</p>
                    <p className="text-xs text-green-600">{balance} ETH</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => setCurrentView('listings')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentView === 'listings'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Fund from Listings</span>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('direct')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentView === 'direct'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Direct Job Funding</span>
            </div>
          </button>
        </div>

        {/* Job Listings View */}
        {currentView === 'listings' && (
          <div className="space-y-6">
            
            {/* Search and Filter */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search job listings..."
                    className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Skills</option>
                  {Object.entries(skillCategories).map(([skillId, skill]) => (
                    <option key={skillId} value={skillId}>{skill.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{listing.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {listing.skillCategories.map((skillId) => {
                        const skill = skillCategories[skillId];
                        return (
                          <div key={skillId} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-gray-200">
                            <div className={`w-3 h-3 rounded bg-gradient-to-br ${skill.color}`}></div>
                            <span className="text-xs font-medium text-gray-700">{skill.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-green-600">{formatCurrency(listing.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(listing.deadline)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedListing(listing);
                        setCurrentView('fund');
                        setFundingData(prev => ({ ...prev, amount: listing.budget.toString() }));
                      }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Fund This Job
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No job listings found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Direct Job Funding View */}
        {currentView === 'direct' && (
          <div className="space-y-6">
            
            {/* Search and Filter */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search service providers..."
                    className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Skills</option>
                  {Object.entries(skillCategories).map(([skillId, skill]) => (
                    <option key={skillId} value={skillId}>{skill.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Providers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div key={provider.address} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-gray-600">{provider.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {provider.skillCategories.map((skillId) => {
                        const skill = skillCategories[skillId];
                        return (
                          <div key={skillId} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-lg border border-gray-200">
                            <div className={`w-3 h-3 rounded bg-gradient-to-br ${skill.color}`}></div>
                            <span className="text-xs font-medium text-gray-700">{skill.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{provider.averageRating} ({provider.ratingCount})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{provider.completedJobs} jobs</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location} • {provider.workType}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedProvider(provider);
                        setCurrentView('fund');
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Fund Direct Job
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No service providers found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Funding Form */}
        {currentView === 'fund' && (selectedListing || selectedProvider) && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Secure Job Funding</h2>
                    <p className="text-white/80 text-sm">Your payment will be held in escrow until completion</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Job/Provider Details */}
                {selectedListing && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Job Listing Details</h3>
                    <div className="space-y-2">
                      <p className="font-medium text-blue-800">{selectedListing.title}</p>
                      <p className="text-blue-700 text-sm">{selectedListing.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600">Budget: {formatCurrency(selectedListing.budget)}</span>
                        <span className="text-blue-600">Deadline: {formatDate(selectedListing.deadline)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedProvider && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Service Provider</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedProvider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{selectedProvider.name}</p>
                        <p className="text-green-600 text-sm">{selectedProvider.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Funding Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Amount (ETH) *
                  </label>
                  <div className="relative">
                    <Wallet className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="number"
                      value={fundingData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.001"
                      className={`w-full pl-12 pr-4 py-3 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.amount ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.amount}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Available balance: {balance} ETH</p>
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
                      value={fundingData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-12 pr-4 py-3 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
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
                
                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description / Requirements
                  </label>
                  <textarea
                    value={fundingData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Describe the project requirements, deliverables, and any specific instructions..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Escrow Terms */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-900">Escrow Protection</h4>
                      <div className="text-sm text-amber-800 space-y-1">
                        <p>• Funds are held securely in smart contract escrow</p>
                        <p>• Service provider receives payment upon successful completion</p>
                        <p>• Automatic release after client approval or dispute resolution</p>
                        <p>• Platform fee: 2.5% of total amount</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    onClick={() => setCurrentView(selectedListing ? 'listings' : 'direct')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFundJob}
                    disabled={!isConnected || isLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Escrow...</span>
                      </div>
                    ) : (
                      'Fund Job & Create Escrow'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Fund Release Demo Section */}
            <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Fund Release Process</h2>
                    <p className="text-white/80 text-sm">How service providers receive their payments</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    
                    {/* Step 1: Work Completion */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                        <h3 className="font-semibold text-blue-900">Work Completion</h3>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Service provider completes work</li>
                        <li>• Submits deliverables to client</li>
                        <li>• Requests fund release</li>
                      </ul>
                    </div>

                    {/* Step 2: Client Review */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                        <h3 className="font-semibold text-amber-900">Client Review</h3>
                      </div>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Client reviews deliverables</li>
                        <li>• 5-day review period</li>
                        <li>• Approve or dispute decision</li>
                      </ul>
                    </div>

                    {/* Step 3: Fund Release */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                        <h3 className="font-semibold text-green-900">Fund Release</h3>
                      </div>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Automatic release on approval</li>
                        <li>• Funds sent to provider wallet</li>
                        <li>• Platform fee deducted</li>
                      </ul>
                    </div>
                  </div>

                  {/* Release Mechanisms */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Fund Release Mechanisms</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Automatic Release</h4>
                            <p className="text-sm text-gray-600">Client approves work within review period</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Timeout Release</h4>
                            <p className="text-sm text-gray-600">Auto-release if no response after 5 days</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Scale className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Dispute Resolution</h4>
                            <p className="text-sm text-gray-600">Arbitrator decides if work disputes arise</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Refund Protection</h4>
                            <p className="text-sm text-gray-600">Partial/full refunds for unsatisfactory work</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Active Jobs */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Active Escrows (Demo)</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">E-commerce Website</h4>
                            <p className="text-sm text-gray-600">Alice Johnson • 5.0 ETH</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                            Pending Review
                          </span>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                            Release Funds
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Mobile Food App</h4>
                            <p className="text-sm text-gray-600">Bob Smith • 8.0 ETH</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            In Progress
                          </span>
                          <span className="text-gray-400 text-sm">3 days remaining</span>
                        </div>
                      </div>
                    </div>
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

export default JobFundingPage;