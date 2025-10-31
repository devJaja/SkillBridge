import React from 'react';
import Logo from "../assets/logo.png"

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Platform",
      links: ["Courses", "Mentorship", "Projects", "Community"]
    },
    {
      title: "Support",
      links: ["Help Center", "Documentation", "Contact Us", "Status"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Blog", "Press"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex text-2xl font-bold bg-gradient-to-r from-[#1C5F75] to-[#2A8FB0] bg-clip-text text-transparent">
              <img src={Logo} alt="" className='w-10 h-10'/>
              Skills-Bridge
            </div>
            <p className="text-gray-400">
              © 2025 SkillBridge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;