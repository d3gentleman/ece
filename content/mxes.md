# MPC eXecution Environments (MXEs)

An **MPC eXecution Environment (MXE)** is a dedicated, compartmentalized environment where computations are defined and securely executed within the Arcium Network. MXEs are highly configurable, enabling Computation Customers to define their security requirements, encryption schemes, and performance parameters.

You can think of an MXE as a virtual machine specifically designed for encrypted execution.

## The Role of an MXE

While **Arx Nodes** provide the computational hardware running within **Clusters**, the **MXE** provides the computation definitions and configuration that govern how those nodes execute tasks:

1. **Configuration**: Computation Customers define parameters like the required hardware specifications, the specific cryptographic protocols to be used, and the Cluster responsible for processing.
2. **Cluster Admission**: MXEs must be admitted by a Cluster before computations can run. A Cluster can concurrently support multiple MXEs. If a single Arx Node rejects the admission of a given MXE to their Cluster, the MXE admission fails.
3. **Onchain Orchestration**: MXE state management and computation orchestration are handled via Solana-based programs, which manage the mempool, track node participation, and facilitate pricing and priority fee markets.

## Joining vs Deploying

When a developer wants to use Arcium for secure data processing, they have two choices:

- Join an existing, globally accessible Cluster with pre-established nodes and security guarantees.
- Configure and deploy their own custom MXE and Cluster to meet unique regulatory, jurisdictional, or performance requirements.
