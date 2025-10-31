// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./libs/Events.sol";

 
contract SkillBridge is ReentrancyGuard {

    enum UserType { ServiceProvider, Client }
    
    enum SkillCategory { 
        WebDevelopment, 
        MobileDevelopment, 
        DataScience, 
        BlockchainDev, 
        DevOps,
        GraphicDesign, 
        ContentWriting, 
        VideoEditing, 
        UIUXDesign,
        Construction, 
        Electrical, 
        Plumbing, 
        HomeMaintenance,
        BusinessStrategy, 
        Marketing, 
        LegalServices, 
        FinancialPlanning
    }
    
    enum WorkType { Remote, Physical, Both }
    
    enum JobStatus { Posted, Funded, InProgress, Completed, Approved, AutoReleased, Cancelled }

    struct UserProfile {
        string name;
        string email;
        SkillCategory[] skillCategories;
        string location;
        WorkType workType;
        UserType userType;
    }
    
    struct JobListing {
        uint256 id;
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        address client;
        bool isOpen;
    }
    
    struct Job {
        uint256 id;
        uint256 listingId;        // Reference to original job listing
        address client;
        address provider;
        uint256 amount;
        uint256 deadline;
        uint256 completedAt;
        JobStatus status;
    }
    
    struct JobFeedback {
        bool hasClientFeedback;
        bool clientApproved;
        string clientComment;
        uint256 clientRating;       // 1-5 stars
        bool hasProviderFeedback;
        string providerComment;
        uint256 feedbackTimestamp;
    }
    
    // User Management
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public registeredUsers;
    address[] public allUsers;
    address[] public serviceProviders;
    address[] public clients;
    
    // Job Listings
    mapping(uint256 => JobListing) public jobListings;
    uint256 public jobListingCount;
    
    // Escrow Jobs
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => JobFeedback) public jobFeedbacks;
    uint256 public jobCounter;
    
    // Reputation System
    mapping(address => uint256) public userRatings;
    mapping(address => uint256) public userRatingCounts;

    mapping(uint256 => address[]) public jobApplicants; // listingId => array of applicant addresses
    
    uint256 public constant CLIENT_RESPONSE_GRACE_PERIOD = 7 days;

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    modifier onlyClient() {
        require(
            registeredUsers[msg.sender] &&
            userProfiles[msg.sender].userType == UserType.Client,
            "Only clients can perform this action"
        );
        _;
    }
    
    modifier onlyProvider() {
        require(
            registeredUsers[msg.sender] &&
            userProfiles[msg.sender].userType == UserType.ServiceProvider,
            "Only service providers can perform this action"
        );
        _;
    }
    
    modifier onlyJobClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Not job client");
        _;
    }
    
    modifier onlyJobProvider(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].provider, "Not job provider");
        _;
    }
    
    modifier jobExists(uint256 _jobId) {
        require(jobs[_jobId].client != address(0), "Job does not exist");
        _;
    }
    
    modifier listingExists(uint256 _listingId) {
        require(jobListings[_listingId].client != address(0), "Job listing does not exist");
        _;
    }
    
    event UserRegistered(address indexed userAddress, UserType userType);
     //Register a new user on the platform
     
    function registerUser(
        string memory _name,
        string memory _email,
        SkillCategory[] memory _skillCategories,
        string memory _location,
        WorkType _workType,
        UserType _userType
    ) external nonReentrant {
        require(!registeredUsers[msg.sender], "Already registered");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_email).length > 0, "Email required");
        
        UserProfile storage newUser = userProfiles[msg.sender];
        newUser.name = _name;
        newUser.email = _email;
        newUser.skillCategories = _skillCategories;
        newUser.location = _location;
        newUser.workType = _workType;
        newUser.userType = _userType;
        
        registeredUsers[msg.sender] = true;
        allUsers.push(msg.sender);
        
        if (_userType == UserType.ServiceProvider) {
            serviceProviders.push(msg.sender);
        } else {
            clients.push(msg.sender);
        }
        
        emit UserRegistered(msg.sender, _userType);
    }
    
   //Update user profile information
     
    function updateProfile(
        string memory _name,
        string memory _email,
        SkillCategory[] memory _skillCategories,
        string memory _location,
        WorkType _workType
    ) external onlyRegistered nonReentrant {
        UserProfile storage user = userProfiles[msg.sender];
        user.name = _name;
        user.email = _email;
        user.skillCategories = _skillCategories;
        user.location = _location;
        user.workType = _workType;
        
        emit Events.ProfileUpdated(msg.sender);
    }
   
    //Post a new job listing
     
    function postJobListing(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _deadline
    ) external onlyClient nonReentrant {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        require(_budget > 0, "Budget must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in future");
        
        jobListingCount++;
        jobListings[jobListingCount] = JobListing({
            id: jobListingCount,
            title: _title,
            description: _description,
            budget: _budget,
            deadline: _deadline,
            client: msg.sender,
            isOpen: true
        });
        
        emit Events.JobListingPosted(jobListingCount, msg.sender);
    }
    
    // Close a job listing
     
    function closeJobListing(uint256 _listingId) 
        external 
        listingExists(_listingId) 
        onlyClient 
    {
        require(jobListings[_listingId].client == msg.sender, "Not listing owner");
        require(jobListings[_listingId].isOpen, "Listing already closed");
        
        jobListings[_listingId].isOpen = false;
        emit Events.JobListingClosed(_listingId);
    }
    
    //Fund a job from a listing and start escrow
     
    function fundJobFromListing(uint256 _listingId, address _provider) 
        external 
        payable 
        listingExists(_listingId) 
        onlyClient 
        nonReentrant 
    {
        JobListing storage listing = jobListings[_listingId];
        require(listing.client == msg.sender, "Not listing owner");
        require(listing.isOpen, "Listing is closed");
        require(msg.value >= listing.budget, "Insufficient funds");
        require(_provider != address(0), "Invalid provider");
        require(registeredUsers[_provider], "Provider not registered");
        require(userProfiles[_provider].userType == UserType.ServiceProvider, "Address is not a service provider");
        
        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            listingId: _listingId,
            client: msg.sender,
            provider: _provider,
            amount: msg.value,
            deadline: listing.deadline,
            completedAt: 0,
            status: JobStatus.Funded
        });
        
        // Close the listing as it's now funded
        listing.isOpen = false;
        
        emit Events.JobFunded(jobCounter, _listingId, msg.sender, msg.value, listing.deadline);
        emit Events.ProviderAssigned(jobCounter, _provider);
        emit Events.JobListingClosed(_listingId);
    }
    //Fund a direct job (without listing)
     
    function fundDirectJob(uint256 _deadline, address _provider) 
        external 
        payable 
        onlyClient 
        nonReentrant 
    {
        require(msg.value > 0, "Must send funds");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_provider != address(0), "Invalid provider");
        require(registeredUsers[_provider], "Provider not registered");
        require(userProfiles[_provider].userType == UserType.ServiceProvider, "Address is not a service provider");
        
        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            listingId: 0, // No listing for direct jobs
            client: msg.sender,
            provider: _provider,
            amount: msg.value,
            deadline: _deadline,
            completedAt: 0,
            status: JobStatus.Funded
        });
        
        emit Events.JobFunded(jobCounter, 0, msg.sender, msg.value, _deadline);
        emit Events.ProviderAssigned(jobCounter, _provider);
    }
    
    //Provider starts the job
     
    function startJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyJobProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not ready to start");
        require(block.timestamp <= jobs[_jobId].deadline, "Job deadline passed");
        
        jobs[_jobId].status = JobStatus.InProgress;
        emit Events.JobStarted(_jobId);
    }
    
    //Provider marks job as completed
     
    function markCompleted(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyJobProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.InProgress, "Job not in progress");
        require(block.timestamp <= jobs[_jobId].deadline, "Cannot complete after deadline");
        
        jobs[_jobId].status = JobStatus.Completed;
        jobs[_jobId].completedAt = block.timestamp;
        
        emit Events.JobCompleted(_jobId, block.timestamp);
    }
    
    // Client approves work and releases funds
     
    function approveWork(uint256 _jobId, uint256 _rating, string calldata _comment) 
        external 
        jobExists(_jobId) 
        onlyJobClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Completed, "Work not completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(!jobFeedbacks[_jobId].hasClientFeedback, "Feedback already provided");
        
        // Release funds immediately
        jobs[_jobId].status = JobStatus.Approved;
        uint256 payment = jobs[_jobId].amount;
        jobs[_jobId].amount = 0;
        
        // Record feedback and update reputation
        JobFeedback storage feedback = jobFeedbacks[_jobId];
        feedback.hasClientFeedback = true;
        feedback.clientApproved = true;
        feedback.clientComment = _comment;
        feedback.clientRating = _rating;
        feedback.feedbackTimestamp = block.timestamp;
        
        // Update provider's reputation
        userRatings[jobs[_jobId].provider] += _rating;
        userRatingCounts[jobs[_jobId].provider]++;
        
        payable(jobs[_jobId].provider).transfer(payment);
        
        emit Events.JobApproved(_jobId, payment, _rating);
    }
    
   
    function rejectWork(uint256 _jobId, uint256 _rating, string calldata _reason) 
        external 
        jobExists(_jobId) 
        onlyJobClient(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Completed, "Work not completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(!jobFeedbacks[_jobId].hasClientFeedback, "Feedback already provided");
        
        // Record rejection feedback
        JobFeedback storage feedback = jobFeedbacks[_jobId];
        feedback.hasClientFeedback = true;
        feedback.clientApproved = false;
        feedback.clientComment = _reason;
        feedback.clientRating = _rating;
        feedback.feedbackTimestamp = block.timestamp;
        
        // Update provider's reputation
        userRatings[jobs[_jobId].provider] += _rating;
        userRatingCounts[jobs[_jobId].provider]++;
        
        emit Events.JobRejected(_jobId, _reason, _rating);
    }
    
    //Auto-release funds after grace period
     
    function autoReleaseAfterGracePeriod(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        nonReentrant 
    {
        Job storage job = jobs[_jobId];
        
        require(job.status == JobStatus.Completed, "Work not completed");
        require(job.completedAt > 0, "Completion time not recorded");
        require(
            block.timestamp > job.completedAt + CLIENT_RESPONSE_GRACE_PERIOD,
            "Grace period not expired"
        );
        
        job.status = JobStatus.AutoReleased;
        uint256 payment = job.amount;
        job.amount = 0;
        
        payable(job.provider).transfer(payment);
        emit Events.JobAutoReleased(_jobId, payment, "Client response grace period expired - auto-released");
    }
    
    //Auto-refund if provider misses deadline
     
    function autoRefundMissedDeadline(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        nonReentrant 
    {
        Job storage job = jobs[_jobId];
        
        require(
            job.status == JobStatus.InProgress || job.status == JobStatus.Funded,
            "Job not eligible for auto-refund"
        );
        require(block.timestamp > job.deadline, "Deadline not passed yet");
        require(job.completedAt == 0, "Work was completed on time");
        
        job.status = JobStatus.Cancelled;
        uint256 refund = job.amount;
        job.amount = 0;
        
        payable(job.client).transfer(refund);
        emit Events.JobAutoRefunded(_jobId, refund, "Provider missed deadline");
    }
    
   //Cancel funded job (only if provider hasn't started)
     
    function cancelJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyJobClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Can only cancel funded jobs");
        
        jobs[_jobId].status = JobStatus.Cancelled;
        uint256 refund = jobs[_jobId].amount;
        jobs[_jobId].amount = 0;
        
        payable(jobs[_jobId].client).transfer(refund);
        emit Events.JobCancelled(_jobId, refund);
    }
    
    //Emergency withdraw for funded jobs
     
    function emergencyWithdraw(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyJobClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not in funded state");
        
        uint256 refund = jobs[_jobId].amount;
        jobs[_jobId].amount = 0;
        jobs[_jobId].status = JobStatus.Cancelled;
        
        payable(msg.sender).transfer(refund);
        emit Events.EmergencyWithdraw(_jobId, refund);
    }
    
    function addProviderResponse(uint256 _jobId, string calldata _response) 
        external 
        jobExists(_jobId) 
        onlyJobProvider(_jobId) 
    {
        require(
            jobs[_jobId].status == JobStatus.Approved || jobs[_jobId].status == JobStatus.AutoReleased,
            "Job not completed yet"
        );
        require(jobFeedbacks[_jobId].hasClientFeedback, "No client feedback to respond to");
        
        JobFeedback storage feedback = jobFeedbacks[_jobId];
        feedback.hasProviderFeedback = true;
        feedback.providerComment = _response;
        
        emit Events.ProviderFeedbackAdded(_jobId, _response);
    }

    function applyForJob(uint256 _listingId) external onlyRegistered nonReentrant {
        require(jobListings[_listingId].client != address(0), "Job listing does not exist");
        require(jobListings[_listingId].isOpen, "Job listing is not open for applications");
        require(userProfiles[msg.sender].userType == UserType.ServiceProvider, "Only service providers can apply");

        // Check if already applied
        bool alreadyApplied = false;
        for (uint256 i = 0; i < jobApplicants[_listingId].length; i++) {
            if (jobApplicants[_listingId][i] == msg.sender) {
                alreadyApplied = true;
                break;
            }
        }
        require(!alreadyApplied, "Already applied for this job");

        jobApplicants[_listingId].push(msg.sender);
        emit Events.JobApplication(msg.sender, _listingId);
    }
    
    
    // User View Functions
    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
    
    function getAllServiceProviders() external view returns (address[] memory) {
        return serviceProviders;
    }
    
    function getAllClients() external view returns (address[] memory) {
        return clients;
    }
    
    function getUserSkills(address _userAddress) 
        external 
        view 
        returns (SkillCategory[] memory) 
    {
        require(registeredUsers[_userAddress], "User not registered");
        return userProfiles[_userAddress].skillCategories;
    }
    
    function getUserAverageRating(address _user) external view returns (uint256) {
        if (userRatingCounts[_user] == 0) return 0;
        return userRatings[_user] / userRatingCounts[_user];
    }
    
    function getUserRatingCount(address _user) external view returns (uint256) {
        return userRatingCounts[_user];
    }
    
    // Job Listing View Functions
    function getJobListing(uint256 _listingId) external view returns (JobListing memory) {
        return jobListings[_listingId];
    }
    
    function getOpenJobListings() external view returns (JobListing[] memory) {
        uint256 openCount = 0;
        
        // Count open listings
        for (uint256 i = 1; i <= jobListingCount; i++) {
            if (jobListings[i].isOpen) {
                openCount++;
            }
        }
        
        // Create array of open listings
        JobListing[] memory openListings = new JobListing[](openCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= jobListingCount; i++) {
            if (jobListings[i].isOpen) {
                openListings[currentIndex] = jobListings[i];
                currentIndex++;
            }
        }
        
        return openListings;
    }

    function getClientJobListings(address _clientAddress) external view returns (JobListing[] memory) {
        uint256 clientJobCount = 0;
        for (uint256 i = 1; i <= jobListingCount; i++) {
            if (jobListings[i].client == _clientAddress) {
                clientJobCount++;
            }
        }

        JobListing[] memory clientListings = new JobListing[](clientJobCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= jobListingCount; i++) {
            if (jobListings[i].client == _clientAddress) {
                clientListings[currentIndex] = jobListings[i];
                currentIndex++;
            }
        }
        return clientListings;
    }
    
    // Escrow View Functions
    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }
    
    function getJobFeedback(uint256 _jobId) external view returns (JobFeedback memory) {
        return jobFeedbacks[_jobId];
    }
    
    function canAutoRefund(uint256 _jobId) external view returns (bool) {
        Job storage job = jobs[_jobId];
        return (
            (job.status == JobStatus.InProgress || job.status == JobStatus.Funded) &&
            block.timestamp > job.deadline &&
            job.completedAt == 0
        );
    }
    
    function canAutoRelease(uint256 _jobId) external view returns (bool) {
        Job storage job = jobs[_jobId];
        return (
            job.status == JobStatus.Completed &&
            job.completedAt > 0 &&
            block.timestamp > job.completedAt + CLIENT_RESPONSE_GRACE_PERIOD
        );
    }
    
    function getTimeUntilDeadline(uint256 _jobId) external view returns (uint256) {
        Job storage job = jobs[_jobId];
        if (block.timestamp >= job.deadline) return 0;
        return job.deadline - block.timestamp;
    }
    
    function getTimeUntilAutoRelease(uint256 _jobId) external view returns (uint256) {
        Job storage job = jobs[_jobId];
        if (job.status != JobStatus.Completed || job.completedAt == 0) return 0;
        
        uint256 autoReleaseTime = job.completedAt + CLIENT_RESPONSE_GRACE_PERIOD;
        if (block.timestamp >= autoReleaseTime) return 0;
        return autoReleaseTime - block.timestamp;
    }
    
    function getUserJobHistory(address _user) external view returns (uint256[] memory) {
        uint256[] memory tempJobs = new uint256[](jobCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= jobCounter; i++) {
            if (jobs[i].client == _user || jobs[i].provider == _user) {
                tempJobs[count] = i;
                count++;
            }
        }
        
        uint256[] memory userJobs = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            userJobs[i] = tempJobs[i];
        }
        
        return userJobs;
    }
}