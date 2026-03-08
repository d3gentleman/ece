# Arcium Clusters

In the Arcium Network, **Clusters** are groups of **Arx Nodes** that collaborate to execute confidential computations. They are created by **Computation Customers**, who define a set of Arx nodes based on specific requirements such as computational capacity, security features, and node reputations.

## Cluster Structure & Node Operations

When a Computation Customer sets up a Cluster, they define the parameters for the nodes that will join it.

- **Arx Nodes**: The decentralized computational workers of the network. They provide the offchain hardware needed to execute the MPC protocols.
- **Node Operators**: Entities running the Arx Nodes. They must stake a minimum self-delegation to activate their nodes and make a **Hardware Claim** indicating their capacity.
- **Third-Party Delegators**: Users who delegate their stake to high-performing Node Operators, increasing the computational weight of those nodes and earning a share of the execution rewards.

A single Cluster can support multiple MPC eXecution Environments (MXEs) concurrently, and MXEs can also be configured to utilize multiple Clusters, providing high availability and flexibility.

### Dynamic Task Assignment

Arcium utilizes the Solana blockchain as a central hub for queuing, assigning, and validating tasks.

1. **Mempool**: Computations are queued into a single **onchain mempool**.
2. **Priority Fees**: Priority fee markets operate within Cluster-specific markets or Cluster unions, ensuring computations only compete for resources with others that share the same nodes.
3. **Execution**: Tasks are assigned dynamically to the available Arx nodes within the cluster, ensuring efficient workload distribution and high throughput.

### Ensuring Integrity (Sybil Resistance)

To protect the network from malicious actors trying to spin up hundreds of fake node identities (Sybil attacks), Arcium employs Proof of Stake economics and requires the inclusion of at least one randomly selected node in all non-permissioned Clusters. As long as at least one honest node exists in a cluster, the integrity and confidentiality of the encrypted computation are mathematically guaranteed to remain intact.
