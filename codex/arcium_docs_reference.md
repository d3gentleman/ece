# Arcium Architecture Reference

The platform must visualize the architecture of the Arcium Network.

The following concepts must be reflected in the system.

## Multi Party Computation

Arcium uses Multi Party Computation to allow encrypted computations where no single party can see the full data.

Data is split into secret shares and distributed across nodes.

Each node processes encrypted fragments of the computation.

The result is reconstructed only after computation completes.

## MXEs

MXEs (Multi Execution Environments) define computation environments in Arcium.

They contain the computation logic executed by clusters.

MXEs are stateless per epoch and can be reused.

Clusters must admit MXEs before computations run.

If a node rejects an MXE admission the MXE fails to run in that cluster.

## Clusters

Clusters are groups of Arx nodes that collaboratively execute MPC computations.

Clusters are created by Computation Customers.

Clusters define:

computational capacity
minimum active nodes
security requirements

Clusters may reuse existing infrastructure.

Clusters must admit MXEs before execution.

Clusters support:

node priority lists
automatic alternative node selection
cluster migration
cluster forking

Clusters distribute different computations across nodes rather than parallelizing a single computation across all nodes.

## Node Priority Lists

Clusters maintain a priority ordered list of nodes.

Backup nodes activate when active nodes fail.

The list is immutable after cluster creation.

## Automatic Node Selection

If nodes fail and priority nodes are unavailable the network selects alternative nodes.

Selection criteria includes:

TEE availability
hardware capacity
trust score
reputation

Clusters may maintain blacklists for nodes or jurisdictions.

## Cluster Forking

Nodes may eject an MXE if they determine it performs undesirable activity.

Nodes that continue supporting the MXE create a new cluster.

Nodes that reject the MXE remain in the original cluster.

## Cluster Migration

Migration moves workloads from one cluster to another.

Two types exist:

Forced migration
Planned migration

Forced migration occurs due to failures such as downtime or slashing.

Planned migration occurs when a node voluntarily exits.

## Sybil Resistance

The network prevents Sybil attacks using:

Proof of Stake
random node inclusion
cluster node scaling
reputation systems
community monitoring
slashing penalties

Non permissioned clusters always include one random node.

This random node helps prevent collusion.

## Arx Nodes

Arx nodes execute MPC protocols.

Nodes belong to Node Operators.

Node Operators may operate multiple nodes.

Node metadata includes:

IP
port
jurisdiction
hardware capability

Nodes must securely store MPC key shares.

Trusted Execution Environments may be used.

## Incentives

Nodes earn rewards for participating in cluster computations.

Rewards are distributed equally across nodes per job.

Nodes with better uptime and reputation receive more cluster opportunities.

Delegation types:

self delegation
third party delegation
