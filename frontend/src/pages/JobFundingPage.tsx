import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import abi from '../abi/SkillBridge.json';
import { 
  Send,
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';

const skillCategories = [
  { id: 'WebDevelopment', name: 'Web Development' },
  { id: 'MobileDevelopment', name: 'Mobile Development' },
  { id: 'DataScience', name: 'Data Science' },
  { id: 'BlockchainDev', name: 'Blockchain Development' },
  { id: 'DevOps', name: 'DevOps' },
  { id: 'GraphicDesign', name: 'Graphic Design' },
  { id: 'ContentWriting', name: 'Content Writing' },
  { id: 'VideoEditing', name: 'Video Editing' },
  { id: 'UIUXDesign', name: 'UI/UX Design' },
  { id: 'Construction', name: 'Construction' },
  { id: 'Electrical', name: 'Electrical' },
  { id: 'Plumbing', name: 'Plumbing' },
  { id: 'HomeMaintenance', name: 'Home Maintenance' },
  { id: 'BusinessStrategy', name: 'Business Strategy' },
  { id: 'Marketing', name: 'Marketing' },
  { id: 'LegalServices', name: 'Legal Services' },
  { id: 'FinancialPlanning', name: 'Financial Planning' }
];

const workTypes = [
  { id: 0, name: 'Remote' },
  { id: 1, name: 'Physical' },
  { id: 2, name: 'Both' }
];

interface JobListing {
  id: bigint;
  title: string;
  description: string;
  budget: bigint;
  deadline: bigint;
  client: string;
  isOpen: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  skillCategories: number[]; // Assuming SkillCategory enum maps to numbers
  location: string;
  workType: number; // Assuming WorkType enum maps to numbers
  userType: number; // Assuming UserType enum maps to numbers
}

const JobFundingPage: React.FC = () => {
  const { id: listingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address: clientAddress } = useAccount();

  const [jobDetails, setJobDetails] = useState<JobListing | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [providerProfile, setProviderProfile] = useState<UserProfile | null>(null);
  const [fundingAmount, setFundingAmount] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

  // Fetch job listing details
  const { data: jobListingData, isLoading: isLoadingJobListing, error: jobListingError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getJobListing',
    args: [BigInt(listingId || 0)],
    query: {
      enabled: !!listingId,
    },
  });

  // Fetch job applicants
  const { data: applicantsData, isLoading: isLoadingApplicants, error: applicantsError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getJobApplicants',
    args: [BigInt(listingId || 0)],
    query: {
      enabled: !!listingId,
    },
  });

  // Fetch provider profile
  const { data: providerProfileData, isLoading: isLoadingProviderProfile, error: providerProfileError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'userProfiles',
    args: [selectedProvider],
    query: {
      enabled: !!selectedProvider,
    },
  });

  useEffect(() => {
    if (jobListingData) {
      const job = jobListingData as JobListing;
      setJobDetails(job);
      setFundingAmount((Number(job.budget) / 100).toString());
      setDeadline(new Date(Number(job.deadline) * 1000).toISOString().split('T')[0]);
    }
  }, [jobListingData]);

  useEffect(() => {
    if (providerProfileData) {
      setProviderProfile(providerProfileData as UserProfile);
    }
  }, [providerProfileData]);

  const { writeContractAsync: fundJobFromListingAsync } = useWriteContract();
  const { writeContractAsync: fundDirectJobAsync } = useWriteContract();

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

  const handleFundJob = async () => {
    if (!clientAddress) {
      setErrorMessage('Please connect your wallet.');
      setTransactionStatus('error');
      return;
    }
    if (!jobDetails && !selectedProvider) {
      setErrorMessage('Please select a job or a provider.');
      setTransactionStatus('error');
      return;
    }
    if (!fundingAmount || parseFloat(fundingAmount) <= 0) {
      setErrorMessage('Please enter a valid funding amount.');
      setTransactionStatus('error');
      return;
    }
    if (!deadline) {
      setErrorMessage('Please enter a valid deadline.');
      setTransactionStatus('error');
      return;
    }

    setTransactionStatus('pending');
    setErrorMessage('');

    try {
      const deadlineTimestamp = BigInt(Math.floor(new Date(deadline).getTime() / 1000));
      const amountInWei = BigInt(parseFloat(fundingAmount) * 100); // Assuming budget is in USD, convert to cents

      let hash: `0x${string}`;

      if (jobDetails && selectedProvider) {
        // Funding from a listing
        hash = await fundJobFromListingAsync({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: 'fundJobFromListing',
          args: [jobDetails.id, selectedProvider as `0x${string}`],
          value: amountInWei,
        });
      } else if (selectedProvider) {
        // Funding a direct job
        hash = await fundDirectJobAsync({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: 'fundDirectJob',
          args: [deadlineTimestamp, selectedProvider as `0x${string}`],
          value: amountInWei,
        });
      } else {
        setErrorMessage('Invalid funding scenario.');
        setTransactionStatus('error');
        return;
      }

      setTxHash(hash);
      setTransactionStatus('confirming');
    } catch (err: any) {
      console.error('Funding failed:', err);
      setTransactionStatus('error');
      setErrorMessage(err.message || 'Failed to fund job.');
    }
  };

  const handleProviderSelect = async (providerAddress: string) => {
    setSelectedProvider(providerAddress);
  };

  if (isLoadingJobListing || isLoadingApplicants || isLoadingProviderProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-xl font-bold">Loading job details and applicants...</h1>
      </div>
    );
  }

  if (jobListingError || applicantsError || providerProfileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        <h1 className="text-xl font-bold">Error loading data:</h1>
        <p>{jobListingError?.message || applicantsError?.message || providerProfileError?.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            Back
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fund Job</h1>
            <p className="text-gray-600">Review job details and select a provider to fund the job.</p>
          </div>
          <div className="p-8 border-t border-gray-200">
            {jobDetails && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Listing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600"><strong>Title:</strong> {jobDetails.title}</p>
                    <p className="text-gray-600"><strong>Description:</strong> {jobDetails.description}</p>
                    <p className="text-gray-600"><strong>Budget:</strong> ${(Number(jobDetails.budget) / 100).toFixed(2)}</p>
                    <p className="text-gray-600"><strong>Deadline:</strong> {new Date(Number(jobDetails.deadline) * 1000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Client:</strong> {jobDetails.client}</p>
                    <p className="text-gray-600"><strong>Status:</strong> {jobDetails.isOpen ? 'Open' : 'Closed'}</p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Applicants</h2>
            {applicantsData && (applicantsData as string[]).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {(applicantsData as string[]).map((applicantAddress) => (
                  <div 
                    key={applicantAddress} 
                    className={`bg-gray-100 p-4 rounded-lg cursor-pointer ${selectedProvider === applicantAddress ? 'border-2 border-indigo-600' : 'border border-gray-200'}`}
                    onClick={() => handleProviderSelect(applicantAddress)}
                  >
                    <p className="font-semibold">{applicantAddress}</p>
                    {/* Display provider profile details if available */}
                    {selectedProvider === applicantAddress && providerProfile && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>Name: {providerProfile.name}</p>
                        <p>Email: {providerProfile.email}</p>
                        <p>Location: {providerProfile.location}</p>
                        <p>Work Type: {workTypes[providerProfile.workType]?.name || 'Unknown'}</p>
                        <p>Skills: {providerProfile.skillCategories.map(skillId => skillCategories[skillId]?.name || 'Unknown').join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-8">No applicants for this job yet.</p>
            )}

            {selectedProvider && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Fund Job</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fundingAmount" className="block text-sm font-medium text-gray-700">Funding Amount (USD)</label>
                    <input
                      type="number"
                      id="fundingAmount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="e.g., 100.00"
                    />
                  </div>
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleFundJob}
                    disabled={transactionStatus === 'pending' || transactionStatus === 'confirming'}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {transactionStatus === 'pending' ? (
                      <>Submitting Transaction...</>
                    ) : transactionStatus === 'confirming' ? (
                      <>Confirming...</>
                    ) : transactionStatus === 'success' ? (
                      <>Job Funded Successfully!</>
                    ) : (
                      <><Send className="w-5 h-5" />Fund Job</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {transactionStatus !== 'idle' && (
              <div className="mt-4 p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                {transactionStatus === 'pending' && (
                  <div className="flex items-center text-blue-600">
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    <span>Preparing transaction...</span>
                  </div>
                )}
                {transactionStatus === 'confirming' && (
                  <div className="flex items-center text-yellow-600">
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    <span>Confirming on blockchain... Please wait for confirmation.</span>
                  </div>
                )}
                {transactionStatus === 'success' && (
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Transaction successful!</span>
                    </div>
                    {txHash && (
                      <p className="text-xs text-gray-600">
                        Transaction: {txHash}
                      </p>
                    )}
                  </div>
                )}
                {transactionStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>Error: {errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFundingPage;
