import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useWriteContract } from 'wagmi';
import SkillBridgeABI from '../abi/SkillBridge.json';
import { Clock, User, ChevronLeft } from 'lucide-react';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

const JobDetailsPage: React.FC = () => {
  useParams<{ id: string }>();
  const location = useLocation();
  const { job } = location.state || {};
  const { writeContract } = useWriteContract();

  const handleApply = () => {
    writeContract({
      address: contractAddress,
      abi: SkillBridgeABI,
      functionName: 'applyForJob',
      args: [job.id],
    });
  };

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Client: {job.client}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Deadline: {new Date(Number(job.deadline) * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="p-8 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Budget</h3>
                    <span className="text-2xl font-bold text-green-600">{Number(job.budget) / 1e18} ETH</span>
                  </div>
                  <button
                    onClick={handleApply}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
