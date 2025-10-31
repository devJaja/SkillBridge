// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UserRegistry is ReentrancyGuard {

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

    struct UserProfile {
        string name;
        string email;
        SkillCategory[] skillCategories;
        string location;
        WorkType workType;
        UserType userType;
    }

    struct Job {
        uint256 id;
        string title;
        string description;
        uint256 budget; // in wei
        uint256 deadline; // timestamp
        address client;
        bool isOpen;
    }

    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public registeredUsers;

    address[] public allUsers;
    address[] public serviceProviders;
    address[] public clients;

    mapping(uint256 => Job) public jobs;
    uint256 public jobCount;

    event UserRegistered(address indexed userAddress, UserType userType);
    event ProfileUpdated(address indexed userAddress);
    event JobPosted(uint256 indexed jobId, address indexed client);

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    modifier onlyClient() {
        require(
            registeredUsers[msg.sender] &&
            userProfiles[msg.sender].userType == UserType.Client,
            "Only clients can do this"
        );
        _;
    }

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

        emit ProfileUpdated(msg.sender);
    }

    function postJob(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _deadline
    ) external onlyClient nonReentrant {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        require(_budget > 0, "Budget must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

        jobCount++;
        jobs[jobCount] = Job({
            id: jobCount,
            title: _title,
            description: _description,
            budget: _budget,
            deadline: _deadline,
            client: msg.sender,
            isOpen: true
        });

        emit JobPosted(jobCount, msg.sender);
    }

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

    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }

}