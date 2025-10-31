import React from 'react';
import { Link } from 'react-router-dom'

import { Code, Wrench, Hammer, Scissors, Stethoscope, GraduationCap } from 'lucide-react';
import Logo from "../assets/logo.png"

const Hero: React.FC = () => {
  const categories = [
    { name: "Developers", icon: <Code className="w-6 h-6" />, color: "from-blue-500 to-cyan-500" },
    { name: "Engineers", icon: <Wrench className="w-6 h-6" />, color: "from-green-500 to-emerald-500" },
    { name: "Carpenters", icon: <Hammer className="w-6 h-6" />, color: "from-amber-500 to-orange-500" },
    { name: "Tailors", icon: <Scissors className="w-6 h-6" />, color: "from-pink-500 to-rose-500" },
    { name: "Doctors", icon: <Stethoscope className="w-6 h-6" />, color: "from-red-500 to-pink-500" },
    { name: "Teachers", icon: <GraduationCap className="w-6 h-6" />, color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-42 h-42 mt-4 rounded-3xl shadow-2xl bg-white/80 border border-indigo-100 transform hover:scale-105 transition-all duration-300">
            <img 
              src={Logo} 
              alt="SkillsBridge Logo" 
              className="w-30 h-30 object-contain" 
            />
          </div>
        </div>

        <div className="text-center space-y-10 mb-20">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 leading-none tracking-tight">
              Bridge Your Skills to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C5F75] via-[#2A8FB0] to-[#163E4B] animate-gradient">
                Success
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Connect with opportunities, enhance your abilities, and unlock your potential across all industries with the platform trusted by professionals worldwide.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/onboarding">
              <button className="group bg-gradient-to-r from-[#1C5F75] to-[#2A8FB0] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#1C5F75]/30 hover:-translate-y-2 transition-all duration-300 transform" >
                <span className="flex items-center gap-2">
                  Get Started Free 
                  <div className="w-2 h-2 bg-white rounded-full group-hover:animate-bounce"></div>
                </span>
              </button>
            </Link>
            
            <button className="group border-2 border-[#1C5F75] text-[#1C5F75] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#1C5F75] hover:text-white hover:shadow-xl hover:shadow-[#1C5F75]/30 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm bg-white/70">
              Browse Categories
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Popular Categories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Skills Across Industries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From tech to traditional crafts, we connect professionals across all industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/50 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-3 hover:bg-white transition-all duration-500 cursor-pointer transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 text-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-24 mb-16">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto shadow-xl border border-white/50">
            <p className="text-xl text-gray-700 mb-6 font-medium">
              Join over{' '}
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl">
                50,000 professionals
              </span>{' '}
              advancing their careers
            </p>
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-600 font-medium">+45,000 more</span>
            </div>
            <div className="flex justify-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse delay-75"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
