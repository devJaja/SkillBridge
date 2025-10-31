// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Events {
    event JobApplication(address indexed applicant, uint256 indexed listingId);
    event ProfileUpdated(address indexed userAddress);
    event JobListingPosted(uint256 indexed listingId, address indexed client);
    event JobListingClosed(uint256 indexed listingId);
     // Escrow Events
    event JobFunded(uint256 indexed jobId, uint256 indexed listingId, address indexed client, uint256 amount, uint256 deadline);
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
}