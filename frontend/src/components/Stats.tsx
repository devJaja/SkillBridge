import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { number: "50K+", label: "Active Learners" },
    { number: "1K+", label: "Expert Mentors" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Platform Support" }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
              <div className="text-indigo-200 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;