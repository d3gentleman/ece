# Secret Sharing & DKG

Secret sharing is a fundamental cryptographic primitive that enables Multi-Party Computation (MPC). It allows you to distribute a secret among a group of participants, each of whom gets a smaller "share" of the secret.

In Arcium, Secret Sharing works hand in hand with **Distributed Key Generation (DKG)** to distribute trust across the network.

## How it works

The shares themselves contain **zero information** about the original secret. It is mathematically impossible to deduce the original data from a single share.

Only when a sufficient threshold of shares are combined can the original secret be mathematically reconstructed.

### Properties of Secret Shares in Arcium

- **Meaningless Individually**: A single secret share looks like entirely random data to the Arx node holding it. Even if a node operator inspects their machine's memory, they cannot learn the original data.
- **Multi-Party Computation**: Arcium utilizes MPC protocols where nodes can actually _perform math directly on the encrypted shares_. If multiple nodes multiply their respective shares of "A" and "B", the reconstructed result will equal "A \* B", even though no node ever knew what A or B were!
- **Threshold Security**: You no longer need to trust a single centralized entity with your data. You only need to trust that a sufficient threshold of the decentralized execution cluster is operating honestly. Even if some nodes are compromised, the secret remains secure.
