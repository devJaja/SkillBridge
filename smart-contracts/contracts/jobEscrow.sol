// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract JobEscrow is ReentrancyGuard {
    enum JobStatus { Funded, InProgress, Completed, Approved, AutoReleased, Cancelled }

    struct Job {
        uint256 id;
        address client;
        address provider;
        uint256 amount;
        uint256 deadline;        // Work completion deadline
        uint256 completedAt;     // When provider marked as completed
        JobStatus status;
    }

    struct JobFeedback {
        bool hasClientFeedback;
        bool clientApproved;       
        string clientComment;       // Client's feedback/reason for rejection
        uint256 clientRating;       // 1-5 stars
        bool hasProviderFeedback;
        string providerComment;     // Provider's response
        uint256 feedbackTimestamp;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => JobFeedback) public jobFeedbacks;
    mapping(address => uint256) public userRatings;        // Total rating points
    mapping(address => uint256) public userRatingCounts;   // Number of ratings received
    uint256 public jobCounter;

    uint256 public constant CLIENT_RESPONSE_GRACE_PERIOD = 7 days;

    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount, uint256 deadline);
    event ProviderAssigned(uint256 indexed jobId, address indexed provider);
    event JobStarted(uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId, uint256 completedAt);
    event JobApproved(uint256 indexed jobId, uint256 amountReleased, uint256 rating);
    event JobRejected(uint256 indexed jobId, string reason, uint256 rating);
    event JobAutoReleased(uint256 indexed jobId, uint256 amountReleased, string reason);
    event JobCancelled(uint256 indexed jobId, uint256 refundAmount);
    event JobAutoRefunded(uint256 indexed jobId, uint256 refundAmount, string reason);
    event EmergencyWithdraw(uint256 indexed jobId, uint256 refundAmount);
    event ProviderFeedbackAdded(uint256 indexed jobId, string comment);

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Not job client");
        _;
    }

    modifier onlyProvider(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].provider, "Not job provider");
        _;
    }

    modifier jobExists(uint256 _jobId) {
        require(jobs[_jobId].client != address(0), "Job does not exist");
        _;
    }

    // Client funds the job with deadline
    function fundJob(uint256 _deadline) external payable nonReentrant {
        require(msg.value > 0, "Must send funds");
        require(_deadline > block.timestamp, "Deadline must be in future");

        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            client: msg.sender,
            provider: address(0),
            amount: msg.value,
            deadline: _deadline,
            completedAt: 0,
            status: JobStatus.Funded
        });

        emit JobFunded(jobCounter, msg.sender, msg.value, _deadline);
    }

    // Client assigns provider
    function assignProvider(uint256 _jobId, address _provider) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not funded");
        require(_provider != address(0), "Invalid provider");
        require(jobs[_jobId].provider == address(0), "Provider already assigned");

        jobs[_jobId].provider = _provider;

        emit ProviderAssigned(_jobId, _provider);
    }

    // Provider starts job
    function startJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not ready to start");
        require(block.timestamp <= jobs[_jobId].deadline, "Job deadline passed");
        
        jobs[_jobId].status = JobStatus.InProgress;
        emit JobStarted(_jobId);
    }

    // Provider marks job as completed (must be before deadline)
    function markCompleted(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.InProgress, "Job not in progress");
        require(block.timestamp <= jobs[_jobId].deadline, "Cannot complete after deadline");

        jobs[_jobId].status = JobStatus.Completed;
        jobs[_jobId].completedAt = block.timestamp;
        
        emit JobCompleted(_jobId, block.timestamp);
    }

    // Approve work and release funds immediately
    function approveWork(uint256 _jobId, uint256 _rating, string calldata _comment) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
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
        
        emit JobApproved(_jobId, payment, _rating);
    }

    // Reject work (Records feedback, but payment still auto-releases after 7 days)
    function rejectWork(uint256 _jobId, uint256 _rating, string calldata _reason) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Completed, "Work not completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(!jobFeedbacks[_jobId].hasClientFeedback, "Feedback already provided");

        // IMPORTANT: Rejection only records feedback - funds still subject to 7-day auto-release!
        // Job remains in "Completed" status, waiting for the 7-day grace period to expire

        // Record rejection feedback (affects reputation but doesn't stop payment)
        JobFeedback storage feedback = jobFeedbacks[_jobId];
        feedback.hasClientFeedback = true;
        feedback.clientApproved = false;  // This is a rejection
        feedback.clientComment = _reason;
        feedback.clientRating = _rating;
        feedback.feedbackTimestamp = block.timestamp;

        // Update provider's reputation (rejection affects rating)
        userRatings[jobs[_jobId].provider] += _rating;
        userRatingCounts[jobs[_jobId].provider]++;

        emit JobRejected(_jobId, _reason, _rating);
    }

    // Do nothing → Auto-release after grace period
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

        // Auto-release doesn't affect reputation since client didn't respond
        payable(job.provider).transfer(payment);
        emit JobAutoReleased(_jobId, payment, "Client response grace period expired - auto-released");
    }

    // Provider can add their response to client feedback
    function addProviderResponse(uint256 _jobId, string calldata _response) 
        external 
        jobExists(_jobId) 
        onlyProvider(_jobId) 
    {
        require(
            jobs[_jobId].status == JobStatus.Approved || jobs[_jobId].status == JobStatus.AutoReleased,
            "Job not completed yet"
        );
        require(jobFeedbacks[_jobId].hasClientFeedback, "No client feedback to respond to");

        JobFeedback storage feedback = jobFeedbacks[_jobId];
        feedback.hasProviderFeedback = true;
        feedback.providerComment = _response;

        emit ProviderFeedbackAdded(_jobId, _response);
    }

    // AUTO-REFUND: If provider misses deadline entirely
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
        emit JobAutoRefunded(_jobId, refund, "Provider missed deadline");
    }

    // Cancel job before provider is assigned
    function cancelJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Can only cancel funded jobs");
        require(jobs[_jobId].provider == address(0), "Provider already assigned");

        jobs[_jobId].status = JobStatus.Cancelled;
        uint256 refund = jobs[_jobId].amount;
        jobs[_jobId].amount = 0;

        payable(jobs[_jobId].client).transfer(refund);
        emit JobCancelled(_jobId, refund);
    }

    // Emergency withdraw: only if no provider assigned
    function emergencyWithdraw(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not in funded state");
        require(jobs[_jobId].provider == address(0), "Provider already assigned");

        uint256 refund = jobs[_jobId].amount;
        jobs[_jobId].amount = 0;
        jobs[_jobId].status = JobStatus.Cancelled;

        payable(msg.sender).transfer(refund);
        emit EmergencyWithdraw(_jobId, refund);
    }

    // View functions
    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }

    function getJobFeedback(uint256 _jobId) external view returns (JobFeedback memory) {
        return jobFeedbacks[_jobId];
    }

    function getUserAverageRating(address _user) external view returns (uint256) {
        if (userRatingCounts[_user] == 0) return 0;
        return userRatings[_user] / userRatingCounts[_user];
    }

    function getUserRatingCount(address _user) external view returns (uint256) {
        return userRatingCounts[_user];
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
}