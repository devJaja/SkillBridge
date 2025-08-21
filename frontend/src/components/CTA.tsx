import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 mt-20">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Bridge Your Future?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join thousands of Clients and Service Providers who have transformed their careers with SkillBridge. Your journey to success starts with a single step.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;