import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import abi from '../abi/SkillBridge.json';
import { Briefcase, DollarSign, Calendar,} from 'lucide-react';

interface JobListing {
  id: bigint;
  title: string;
  description: string;
  budget: bigint;
  deadline: bigint;
  client: `0x${string}`;
  isOpen: boolean;
}

const BrowseJobsPage: React.FC = () => {
  const { isConnected } = useAccount();
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

  const { data: openJobListings, isLoading, isError, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getOpenJobListings',
    query: {
      enabled: isConnected,
    },
  });

  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    if (openJobListings) {
      // Type assertion to help TypeScript understand the structure
      const typedListings = openJobListings as JobListing[];
      setJobs(typedListings);
    }
  }, [openJobListings]);

  const formatDeadline = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  const formatBudget = (budgetWei: bigint) => {
    return (Number(budgetWei) / 10**18).toFixed(2);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-600">
          Please connect your wallet to browse available jobs.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center text-red-600">
          Error loading jobs: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Browse Open Jobs</h1>
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 text-center text-gray-600">
            No open job listings available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id.toString()} className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6 flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{job.description}</p>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Budget: {formatBudget(job.budget)} ETH</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Deadline: {formatDeadline(job.deadline)}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Client: {job.client.slice(0, 6)}...{job.client.slice(-4)}</span>
                  </div>
                </div>
                <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobsPage;