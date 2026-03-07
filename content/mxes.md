# Multiparty eXecution Environments (MXEs)

A **Multiparty eXecution Environment (MXE)** is a customizable cryptographic standard that defines the rules, participation criteria, and execution logic of a specific decentralized network within Arcium.

You can think of an MXE as its own customizable "app-chain" specifically designed for encrypted execution.

## The Role of an MXE

While **Arx Nodes** provide the computational hardware, the **MXE** provides the configuration and ruleset that govern how those nodes collaborate:

1. **Configuration**: Developers define parameters like the required hardware specifications, the number of nodes in the Cluster, and the specific cryptographic protocols to be used for computation.
2. **Node Admission**: Arx Nodes opt-in to join specific MXEs. If they meet the hardware and staking criteria defined by the MXE, they become part of its **Execution Cluster**.
3. **Smart Contracts**: An MXE is governed by its smart contracts deployed on the Solana blockchain. These contracts act as a supreme ledger that manages the mempool, tracks node participation, and facilitates pricing and priority fee markets.

## Joining vs Deploying

When a developer wants to use Arcium for secure data processing, they have two choices:

- Join an existing, globally accessible MXE with pre-established nodes and security guarantees.
- Configure and deploy their own custom MXE to meet unique regulatory, jurisdictional, or performance requirements.
