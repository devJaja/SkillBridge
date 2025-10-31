import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

interface ClientRegistrationFormProps {
  onRegister: (name: string, email: string, location: string) => Promise<void>;
  onUpdateProfile: (name: string, email: string, location: string) => Promise<void>;
  transactionStatus: 'idle' | 'pending' | 'confirming' | 'success' | 'error';
  errorMessage: string;
  isUserRegistered: boolean;
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ onRegister, onUpdateProfile, transactionStatus, errorMessage, isUserRegistered }) => {
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    location: '',
  });

  const handleAction = () => {
    const { name, email, location } = registrationData;
    if (!name || !email || !location) {
      alert('Please fill in all required fields');
      return;
    }

    if (isUserRegistered) {
      onUpdateProfile(name, email, location);
    } else {
      onRegister(name, email, location);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8">
          <div className="text-center mb-8">
            <UserPlus className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isUserRegistered ? 'Become a Client' : 'Register as Client'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isUserRegistered ? 'Update your profile to become a client and post jobs' : 'You need to register before posting jobs'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Name *</label>
              <input
                type="text"
                value={registrationData.name}
                onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email *</label>
              <input
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Location *</label>
              <input
                type="text"
                value={registrationData.location}
                onChange={(e) => setRegistrationData({ ...registrationData, location: e.target.value })}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                placeholder="City, Country"
              />
            </div>

            <button
              onClick={handleAction}
              disabled={transactionStatus === 'pending' || transactionStatus === 'confirming'}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {transactionStatus === 'pending' ? 
                (isUserRegistered ? 'Updating...' : 'Registering...') : 
                (isUserRegistered ? 'Become a Client' : 'Register as Client')
              }
            </button>

            {transactionStatus === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;