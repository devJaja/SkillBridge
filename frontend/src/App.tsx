import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import ClientProfile from './pages/ClientProfile'
import Header from './components/Header'
import Footer from './components/Footer'
import PostJobPage from './pages/PostJobPage'
import ServiceProviderProfile from './pages/ServiceProviderProfile'
import JobFundingPage from './pages/JobFundingPage'
import BrowseJobsPage from './pages/BrowseJobsPage'
import JobDetailsPage from './pages/JobDetailsPage'


function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path='/clientprofile' element={<ClientProfile/>}/>
        <Route path="/post" element={<PostJobPage />} />
        <Route path='providerprofile' element={<ServiceProviderProfile/>} />
        <Route path='job-funding' element={<JobFundingPage/>} />
        <Route path='/browse-jobs' element={<BrowseJobsPage />} />
        <Route path='/job/:id' element={<JobDetailsPage />} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
