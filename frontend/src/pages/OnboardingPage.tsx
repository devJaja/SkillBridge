import React, { useState } from 'react';
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Monitor,
  Building,
  Globe,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
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
  Shield,
  Star,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import abi from "../abi/SkillBridge.json";

import Loggo from "../assets/loggo.png"

// Skill categories with icons matching the smart contract
const skillCategories = [
  { id: 'WebDevelopment', name: 'Web Development', icon: <Code className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
  { id: 'MobileDevelopment', name: 'Mobile Development', icon: <Smartphone className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'DataScience', name: 'Data Science', icon: <BarChart3 className="w-5 h-5" />, color: 'from-purple-500 to-indigo-500' },
  { id: 'BlockchainDev', name: 'Blockchain Development', icon: <Bitcoin className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
  { id: 'DevOps', name: 'DevOps', icon: <Server className="w-5 h-5" />, color: 'from-gray-500 to-slate-500' },
  { id: 'GraphicDesign', name: 'Graphic Design', icon: <Palette className="w-5 h-5" />, color: 'from-pink-500 to-rose-500' },
  { id: 'ContentWriting', name: 'Content Writing', icon: <PenTool className="w-5 h-5" />, color: 'from-teal-500 to-cyan-500' },
  { id: 'VideoEditing', name: 'Video Editing', icon: <Video className="w-5 h-5" />, color: 'from-red-500 to-pink-500' },
  { id: 'UIUXDesign', name: 'UI/UX Design', icon: <Layers className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' },
  { id: 'Construction', name: 'Construction', icon: <Home className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
  { id: 'Electrical', name: 'Electrical', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-400 to-yellow-500' },
  { id: 'Plumbing', name: 'Plumbing', icon: <Wrench className="w-5 h-5" />, color: 'from-blue-600 to-blue-500' },
  { id: 'HomeMaintenance', name: 'Home Maintenance', icon: <Settings className="w-5 h-5" />, color: 'from-gray-600 to-gray-500' },
  { id: 'BusinessStrategy', name: 'Business Strategy', icon: <Target className="w-5 h-5" />, color: 'from-emerald-500 to-green-500' },
  { id: 'Marketing', name: 'Marketing', icon: <Megaphone className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
  { id: 'LegalServices', name: 'Legal Services', icon: <Scale className="w-5 h-5" />, color: 'from-slate-600 to-gray-600' },
  { id: 'FinancialPlanning', name: 'Financial Planning', icon: <Calculator className="w-5 h-5" />, color: 'from-green-600 to-emerald-600' }
];


// Must match Solidity enum order exactly
const skillCategoryMap: Record<string, number> = {
  WebDevelopment: 0,
  MobileDevelopment: 1,
  DataScience: 2,
  BlockchainDev: 3,
  DevOps: 4,
  GraphicDesign: 5,
  ContentWriting: 6,
  VideoEditing: 7,
  UIUXDesign: 8,
  Construction: 9,
  Electrical: 10,
  Plumbing: 11,
  HomeMaintenance: 12,
  BusinessStrategy: 13,
  Marketing: 14,
  LegalServices: 15,
  FinancialPlanning: 16,
};

const workTypeMap: Record<string, number> = {
  Remote: 0,
  Physical: 1,
  Both: 2,
};

const userTypeMap: Record<string, number> = {
  ServiceProvider: 0,
  Client: 1,
};

const workTypes = [
  { id: 'Remote', name: 'Remote', icon: <Monitor className="w-6 h-6" />, description: 'Work from anywhere in the world' },
  { id: 'Physical', name: 'On-site', icon: <Building className="w-6 h-6" />, description: 'Physical presence required' },
  { id: 'Both', name: 'Hybrid', icon: <Globe className="w-6 h-6" />, description: 'Flexible remote and on-site' }
];

const userTypes = [
  { 
    id: 'ServiceProvider', 
    name: 'Service Provider', 
    description: 'I want to offer my skills and earn income',
    icon: <Briefcase className="w-12 h-12" />,
    features: ['Create professional profile', 'Apply to verified projects', 'Build reputation on-chain', 'Receive secure payments'],
    benefits: ['Trustless payments', 'Global opportunities', 'Fair dispute resolution']
  },
  { 
    id: 'Client', 
    name: 'Client', 
    description: 'I want to hire skilled professionals',
    icon: <User className="w-12 h-12" />,
    features: ['Post project requirements', 'Browse verified providers', 'Manage multiple projects', 'Secure escrow payments'],
    benefits: ['Quality assurance', 'Reputation-based hiring', 'Protected payments']
  }
];

interface FormData {
  userType: string;
  name: string;
  email: string;
  location: string;
  workType: string;
  skillCategories: string[];
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Wagmi hooks
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    name: '',
    email: '',
    location: '',
    workType: '',
    skillCategories: []
  });

  const totalSteps = 4;

  // Navigate to profile page after successful transaction
  React.useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        navigate("/clientprofile");
      }, 2000);
    }
  }, [isConfirmed, navigate]);
  

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.includes(skillId)
        ? prev.skillCategories.filter(id => id !== skillId)
        : [...prev.skillCategories, skillId]
    }));
  };


const handleSubmit = async () => {
  try {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) throw new Error("Missing contract address in .env");

    // Map form values → enum numbers
    const skillEnums = formData.skillCategories.map((id) => skillCategoryMap[id]); 
    const workTypeEnum = workTypeMap[formData.workType];
    const userTypeEnum = userTypeMap[formData.userType];

    if (
      !formData.name ||
      !formData.email ||
      !formData.location ||
      skillEnums.length === 0 ||
      workTypeEnum === undefined ||
      userTypeEnum === undefined
    ) {
      throw new Error("Please fill in all fields");
    }

    console.log("Args going to contract:", {
      name: formData.name,
      email: formData.email,
      skills: skillEnums,
      location: formData.location,
      workType: workTypeEnum,
      userType: userTypeEnum,
    });

    await writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "registerUser",
      args: [
        formData.name,      // string
        formData.email,     // string
        skillEnums,         // uint8[]
        formData.location,  // string
        workTypeEnum,       // uint8
        userTypeEnum,       // uint8
      ],
    });

    console.log(" User registered successfully");

    if (formData.userType === "ServiceProvider") {
      navigate("/providerprofile");
    } else {
      navigate("/clientprofile");
    }
  } catch (err) {
    console.error(" Registration failed:", err);
    alert(err instanceof Error ? err.message : "Unknown error");
  }
};


  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.userType !== '';
      case 2: return formData.name.trim() !== '' && formData.email.trim() !== '';
      case 3: return formData.location.trim() !== '' && formData.workType !== '';
      case 4: return formData.skillCategories.length > 0;
      default: return false;
    }
  };

  const stepTitles: { [key: number]: string } = {
    1: 'Account Type',
    2: 'Personal Details',
    3: 'Work Preferences',
    4: formData.userType === 'ServiceProvider' ? 'Your Expertise' : 'Service Needs'
  };

  // Show error message if there's a transaction error
  const getErrorMessage = () => {
    if (error) {
      if (error.message.includes('User rejected')) {
        return 'Transaction was rejected by user';
      }
      if (error.message.includes('insufficient funds')) {
        return 'Insufficient funds for transaction';
      }
      return `Transaction failed: ${error.message}`;
    }
    return null;
  };
  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className='w-full max-w-7xl'>
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={Loggo} alt="" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Professional Onboarding</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        i + 1 < currentStep 
                          ? 'bg-green-500 text-white' 
                          : i + 1 === currentStep
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < totalSteps - 1 && (
                      <div className={`w-12 h-1 mx-2 rounded-full transition-colors duration-300 ${
                        i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          
          {/* Step Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{stepTitles[currentStep]}</h2>
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Step 1: User Type Selection */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="text-center mb-8 lg:mb-12">
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose how you want to participate in the SkillBridge ecosystem
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {userTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setFormData({ ...formData, userType: type.id })}
                    className={`group cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                      formData.userType === type.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-xl ring-4 ring-indigo-500/20'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <div className="p-6 lg:p-8">
                      {/* Header */}
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center transition-all duration-300 ${
                          formData.userType === type.id
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          {type.icon}
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mt-4 mb-2">{type.name}</h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Key Features</h4>
                        {type.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600 leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Benefits */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {type.benefits.map((benefit, idx) => (
                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${
                              formData.userType === type.id
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {formData.userType === type.id && (
                        <div className="mt-6 flex items-center justify-center space-x-2 text-indigo-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Help us personalize your SkillBridge experience
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <p className="text-sm text-gray-500 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>We'll never share your email with third parties</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Work Type */}
          {currentStep === 3 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Configure your location and work preferences
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Location *
                  </label>
                  <div className="relative group">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, State/Province, Country"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Work Type Preference *
                  </label>
                  <div className="grid md:grid-cols-3 gap-6">
                    {workTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setFormData({ ...formData, workType: type.id })}
                        className={`cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          formData.workType === type.id
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-4 ring-indigo-500/20'
                            : 'border-gray-200 hover:border-indigo-300 bg-white'
                        }`}
                      >
                        <div className="p-6 text-center space-y-4">
                          <div className={`w-16 h-16 rounded-xl mx-auto flex items-center justify-center transition-all duration-300 ${
                            formData.workType === type.id
                              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{type.name}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{type.description}</p>
                          </div>
                          {formData.workType === type.id && (
                            <div className="flex items-center justify-center space-x-2 text-indigo-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold text-sm">Selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Skills Selection */}
          {currentStep === 4 && (
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {formData.userType === 'ServiceProvider' 
                    ? 'Select the skills and services you can provide to clients' 
                    : 'Choose the types of services you typically need for your projects'
                  }
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>You can update these selections later</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {skillCategories.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-md group ${
                      formData.skillCategories.includes(skill.id)
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-500/20'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <div className="p-5 text-center space-y-3">
                      <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center bg-gradient-to-br ${skill.color} text-white transition-transform duration-300 group-hover:scale-110 ${
                        formData.skillCategories.includes(skill.id) ? 'scale-110 shadow-lg' : ''
                      }`}>
                        {skill.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{skill.name}</h3>
                        {formData.skillCategories.includes(skill.id) && (
                          <div className="mt-2 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.skillCategories.length > 0 && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-center space-x-3 text-green-700">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold">Great choice!</p>
                        <p className="text-sm">
                          {formData.skillCategories.length} skill{formData.skillCategories.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="bg-gray-50 px-6 sm:px-8 lg:px-12 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                      isStepValid()
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
  onClick={handleSubmit}
  disabled={!isStepValid() || isPending || isConfirming}
  className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
    isStepValid() && !isPending && !isConfirming
      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:scale-105 shadow-lg'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  {isPending && <span>Submitting…</span>}
  {isConfirming && <span>Waiting for confirmation…</span>}
  {isConfirmed && <span>Registered!</span>}
  {!isPending && !isConfirming && !isConfirmed && <span>Complete Registration</span>}
  <Star className="w-5 h-5" />
</button>


                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OnboardingPage;