import React from 'react';
import { ShieldCheck, Coins, Link2, FileCheck, Users, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Trustless Contracts",
      description: "All agreements between clients and professionals are secured by smart contracts—transparent, automated, and tamper-proof."
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: "On-Chain Payments",
      description: "Seamlessly send and receive crypto payments with escrow protection, ensuring fairness for both clients and providers."
    },
    {
      icon: <Link2 className="w-8 h-8" />,
      title: "Cross-Industry Connection",
      description: "Whether you're a developer, doctor, or designer, SkillBridge connects every profession into a single decentralized hub."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Verified On-Chain Identity",
      description: "Profiles and credentials are blockchain-verified, making it easy to prove skills and build trust without intermediaries."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Decentralized Community",
      description: "Collaborate, form teams, and grow your network globally with professionals across every industry, powered by Web3."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Borderless Opportunities",
      description: "SkillBridge removes geographical barriers—hire or get hired anywhere in the world with instant, secure transactions."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Choose SkillBridge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering every profession on-chain with trustless contracts, borderless payments, and a global decentralized community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
