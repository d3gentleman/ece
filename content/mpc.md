# Multi-Party Computation (MPC)

The Arcium Network utilizes Multi-Party Computation (MPC) to allow encrypted computations where no single party can see the full data. This represents a paradigm shift in data privacy and execution integrity.

## How it works

In a traditional compute environment, if you want a server to process your data, you must send it your data in plaintext. This forces you to trust that the server will not leak, steal, or misuse your information.

MPC removes this requirement of trust entirely. Through cryptographic algorithms, data is evaluated while remaining completely encrypted.

### The Lifecycle of an Arcium Computation:

1. **Definition**: A computation is defined by a developer within the context of a Multiparty eXecution Environment (MXE). It specifies inputs, outputs, operations, and access permissions.
2. **Commissioning**: A _Computation Customer_ instantiates the computation by specifying arguments, execution windows, and paying the base and priority fees.
3. **Mempool Placement**: Commissioned computations are queued in the global Solana mempool, waiting for execution by the Arcium network.
4. **Encrypted Execution**: A Cluster of Arx Nodes executes the computation securely using Multi-Party Computation. They perform math directly on encrypted fragments without ever decrypting the underlying data.
5. **Post-Execution Callbacks**: Following execution, actions defined for success or failure are carried out automatically via onchain program callbacks to deliver the result to the designated recipient.

This mechanism ensures data privacy while still leveraging massive decentralized computational power!
