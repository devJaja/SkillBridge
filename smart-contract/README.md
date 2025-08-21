# SkillBridge

SkillBridge  is a decentralized application (dApp) that connects skilled professionals across various industries with clients seeking their services. The platform supports both remote and physical work arrangements with blockchain-powered trusted payments.
 **clients** and **service providers** through smart contracts.  
It features **escrow-based payments**, milestone tracking, job approvals, and review systems — ensuring trust and transparency for both parties.

---

## 📌 Features

- **Client/Provider Roles**
  - Clients can post jobs with a budget and deadline.
  - Providers can accept tasks assigned by clients.
  
- **Escrow Payment System**
  - Client deposits funds when creating a job.
  - Funds are locked until the work is completed and approved.
  - Automatic payment release to the provider after client approval.

- **Job Management**
  - Assign providers to jobs.
  - Track job status: `Funded`, `InProgress`, `Completed`, `Approved`, `Cancelled`.
  - Emergency withdrawal (only if no provider assigned).

- **Security**
  - Reentrancy protection using OpenZeppelin’s `ReentrancyGuard`.
  - Immutable job data after funding.
  - Funds cannot be withdrawn without meeting contract conditions.

---

## 🛠 Tech Stack

- **Smart Contracts**: Solidity (v0.8.x)
- **Security Libraries**: [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- **Blockchain**: Ethereum / EVM-compatible networks (Sepolia for testing)
- **Development Environment**: Hardhat
- **Frontend**: React + TailwindCSS (planned integration)
- **Wallets**: MetaMask, WalletConnect

---

## 📂 Project Structure

