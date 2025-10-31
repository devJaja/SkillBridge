// components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from "../assets/logo.png"
import ConnectButton from './ConnectButton';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg py-4' 
        : 'bg-white/95 backdrop-blur-lg py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center" onClick={() => navigate('/')}>
            <img src={Logo} alt="" className='w-10 h-10' />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1C5F75] to-[#1C5F75] bg-clip-text text-transparent">
              Skills-Bridge
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              About
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Contact
            </a>
            <button onClick={() => navigate('/post')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Post Job
            </button>
              <ConnectButton/>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#features" className="text-gray-700 font-medium">Features</a>
              <a href="#about" className="text-gray-700 font-medium">About</a>
              <a href="#pricing" className="text-gray-700 font-medium">Pricing</a>
              <a href="#contact" className="text-gray-700 font-medium">Contact</a>
              <button onClick={() => navigate('/post')} className="text-gray-700 font-medium">Post Job</button>
              <ConnectButton/>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;