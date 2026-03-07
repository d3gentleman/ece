# Arcium Clusters

In the Arcium network, **Clusters** are the fundamental units of decentralized execution. A cluster is a specialized group of **Arx Nodes** that collaboratively execute computations according to the rules of a specific **Multiparty eXecution Environment (MXE)**.

## Cluster Structure & Node Operations

When a developer sets up an MXE, they define the parameters for the nodes that will join its cluster.

- **Arx Nodes**: The decentralized computational workers of the network. They provide the offchain hardware needed to execute the MPC protocols.
- **Node Operators**: Entities running the Arx Nodes. They must stake a minimum self-delegation to activate their nodes and make a **Hardware Claim** indicating their capacity.
- **Third-Party Delegators**: Users who delegate their stake to high-performing Node Operators, increasing the computational weight of those nodes and earning a share of the execution rewards.

### Dynamic Task Assignment

Arcium utilizes the Solana blockchain as a central hub for queuing, assigning, and validating tasks.

1. **Mempool**: Computations are queued into an **onchain mempool**.
2. **Priority Fees**: Markets operate within Cluster-specific mempool queues, ensuring computations only compete for resources with others targeting the same MXE.
3. **Execution**: Tasks are assigned dynamically to the available Arx nodes within the cluster, ensuring efficient workload distribution and high throughput.

### Ensuring Integrity (Sybil Resistance)

To protect the network from malicious actors trying to spin up hundreds of fake node identities (Sybil attacks), Arcium employs Proof of Stake economics and cryptographic Threshold structures. As long as a fraction of the nodes in the cluster remain honest, the integrity and privacy of the encrypted computation are mathematically guaranteed to remain intact.
