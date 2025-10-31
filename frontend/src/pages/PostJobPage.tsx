import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import abi from '../abi/SkillBridge.json';
import { Briefcase, DollarSign, Calendar, CheckCircle, Loader, AlertCircle, Sparkles, Zap } from 'lucide-react';

const PostJobPage: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

  const { data: userProfileData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'userProfiles',
    args: [userAddress],
    query: {
      enabled: isConnected && !!userAddress,
    }
  });

  useEffect(() => {
    console.log('userAddress:', userAddress);
    console.log('userProfileData:', JSON.stringify(userProfileData, null, 2));
    if (userProfileData && Array.isArray(userProfileData) && userProfileData.length === 5) {
      // @ts-ignore
      setIsClient(userProfileData[4] === 1); // Assuming 1 is the enum value for Client
    } else {
      setIsClient(false);
    }
  }, [userProfileData, userAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setErrorMessage('Please connect your wallet to post a job.');
      setTransactionStatus('error');
      return;
    }
    if (!isClient) {
      setErrorMessage('You must be registered as a Client to post a job.');
      setTransactionStatus('error');
      return;
    }

    setTransactionStatus('pending');
    setErrorMessage('');

    try {
      const deadlineTimestamp = BigInt(Math.floor(new Date(deadline).getTime() / 1000));
      const budgetInWei = BigInt(parseFloat(budget) * 10**18);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'postJobListing',
        args: [title, description, budgetInWei, deadlineTimestamp],
        gas: 5000000n,
      });
      setTxHash(hash);
      setTransactionStatus('confirming');
    } catch (err: any) {
      console.error('Job posting failed:', err);
      setTransactionStatus('error');
      setErrorMessage(err.message || 'Failed to post job.');
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash: txHash as `0x${string}` | undefined,
  });

  useEffect(() => {
    if (isConfirming) {
      setTransactionStatus('confirming');
    } else if (isConfirmed) {
      setTransactionStatus('success');
      setTimeout(() => setTransactionStatus('idle'), 3000);
    }
  }, [isConfirming, isConfirmed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
              Create Your Dream Job
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with top talent and bring your project to life with blockchain-powered security
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white mr-3" />
                <h2 className="text-2xl font-semibold text-white">Job Details</h2>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Job Title */}
                <div className="group">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                    Job Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-500 text-lg"
                      placeholder="e.g., Build a Revolutionary DeFi Platform"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div className="group">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                    Project Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      className="w-full p-4 text-gray-900 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-500 text-lg resize-none"
                      placeholder="Describe your vision, requirements, and what success looks like. Be detailed to attract the right talent."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Budget and Deadline Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div className="group">
                    <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-3">
                      Budget (ETH)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="budget"
                        id="budget"
                        className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder-gray-500 text-lg"
                        placeholder="2.5"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="group">
                    <label htmlFor="deadline" className="block text-sm font-semibold text-gray-800 mb-3">
                      Project Deadline
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      </div>
                      <input
                        type="date"
                        name="deadline"
                        id="deadline"
                        className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-gray-500 text-lg"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={transactionStatus === 'pending' || transactionStatus === 'confirming'}
                    className="w-full relative overflow-hidden group"
                  >
                    <div className={`
                      w-full flex items-center justify-center py-5 px-6 rounded-2xl text-xl font-bold transition-all duration-300 transform
                      ${transactionStatus === 'success' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                        : transactionStatus === 'pending' || transactionStatus === 'confirming'
                        ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-lg shadow-blue-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-1 cursor-pointer'
                      }
                    `}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center justify-center">
                        {transactionStatus === 'pending' ? (
                          <>
                            <Loader className="animate-spin w-6 h-6 mr-3" />
                            <span>Preparing Transaction...</span>
                          </>
                        ) : transactionStatus === 'confirming' ? (
                          <>
                            <Loader className="animate-spin w-6 h-6 mr-3" />
                            <span>Confirming on Blockchain...</span>
                          </>
                        ) : transactionStatus === 'success' ? (
                          <>
                            <CheckCircle className="w-6 h-6 mr-3" />
                            <span>Job Posted Successfully!</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 mr-3" />
                            <span>Post Job & Find Talent</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Status Messages */}
          {transactionStatus === 'error' && (
            <div className="mt-6 mx-auto max-w-2xl">
              <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center justify-center text-red-700">
                  <div className="bg-red-100 rounded-full p-2 mr-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Transaction Failed</h3>
                    <p className="text-red-600 mt-1">{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {transactionStatus === 'success' && (
            <div className="mt-6 mx-auto max-w-2xl">
              <div className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center justify-center text-green-700">
                  <div className="bg-green-100 rounded-full p-2 mr-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Job Posted Successfully!</h3>
                    <p className="text-green-600 mt-1">Your job is now live and visible to talented freelancers</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;