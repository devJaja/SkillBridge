// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract JobEscrow is ReentrancyGuard {
    enum JobStatus { Funded, InProgress, Completed, Approved, Cancelled }

    struct Job {
        uint256 id;
        address client;
        address provider;
        uint256 amount;
        JobStatus status;
    }

    mapping(uint256 => Job) public jobs;
    uint256 public jobCounter;

    event JobFunded(uint256 indexed jobId, address indexed client, uint256 amount);
    event ProviderAssigned(uint256 indexed jobId, address indexed provider);
    event JobStarted(uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId);
    event JobApproved(uint256 indexed jobId, uint256 amountReleased);
    event JobCancelled(uint256 indexed jobId, uint256 refundAmount);
    event EmergencyWithdraw(uint256 indexed jobId, uint256 refundAmount);

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

    // Step 1: Client funds the job (no provider yet)
    function fundJob() external payable nonReentrant {
        require(msg.value > 0, "Must send funds");

        jobCounter++;
        jobs[jobCounter] = Job({
            id: jobCounter,
            client: msg.sender,
            provider: address(0),
            amount: msg.value,
            status: JobStatus.Funded
        });

        emit JobFunded(jobCounter, msg.sender, msg.value);
    }

    // Step 2: Client assigns provider
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

    // Step 3: Provider starts job
    function startJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Job not ready to start");
        jobs[_jobId].status = JobStatus.InProgress;
        emit JobStarted(_jobId);
    }

    // Step 4: Provider marks job as completed
    function markCompleted(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyProvider(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.InProgress, "Job not in progress");
        jobs[_jobId].status = JobStatus.Completed;
        emit JobCompleted(_jobId);
    }

    // Step 5: Client approves and releases funds
    function approveWork(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Completed, "Work not completed");

        jobs[_jobId].status = JobStatus.Approved;
        uint256 payment = jobs[_jobId].amount;
        jobs[_jobId].amount = 0; // prevent re-entrancy
        payable(jobs[_jobId].provider).transfer(payment);

        emit JobApproved(_jobId, payment);
    }

    // Cancel job before provider is assigned
    function cancelJob(uint256 _jobId) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Funded, "Cannot cancel now");
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

    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }
}
