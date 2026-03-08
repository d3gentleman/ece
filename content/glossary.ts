export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: string;
  link?: {
    label: string;
    url: string;
  };
  imagePath?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Arcis',
    definition: 'Arcium\'s Rust-based developer framework for building privacy-preserving and encrypted applications. It includes a framework and compiler to support all Arcium protocols.',
    category: 'Architecture',
    link: { label: 'Architecture', url: '/architecture' }
  },
  {
    term: 'Arcium',
    definition: 'A fast, flexible, and low-cost infrastructure for accessing encrypted computation via the blockchain. Arcium acts as an encrypted supercomputer that enables trustless, verifiable, and efficient computing over fully encrypted data.',
    category: 'Network'
  },
  {
    term: 'arxOS',
    definition: 'The distributed, encrypted operating system powering Arcium and its network of Arx Nodes. It manages the execution of computations defined by MXEs across clusters.',
    category: 'Architecture',
    link: { label: 'Architecture', url: '/architecture' }
  },
  {
    term: 'Arx Node',
    definition: 'Decentralized computational workers that perform computations on encrypted data. Derived from the Latin "arx" (fortress), each node represents a secure point in the network.',
    category: 'Network',
    link: { label: 'View Nodes', url: '/architecture' }
  },
  {
    term: 'Byzantine Fault Tolerance (BFT)',
    definition: 'A system property that allows the network to function correctly even if some nodes fail or act maliciously. BFT ensures reliability and continuous operation in a decentralized environment.',
    category: 'Security'
  },
  {
    term: 'Cerberus',
    definition: 'A "dishonest majority" Multi-Party Computation (MPC) protocol supported by Arcium, designed for high security environments where most participants are not trusted.',
    category: 'Protocols',
    link: { label: 'MPC Visualizer', url: '/visualizer' }
  },
  {
    term: 'Cluster',
    definition: 'A collaborative group of Arx Nodes assembled to execute Multi-Party Computation (MPC) operations. Clusters are dynamic and can be configured with specific security and performance parameters.',
    category: 'Network',
    link: { label: 'Explore Clusters', url: '/architecture' },
    imagePath: '/assets/glossary/clusters_icon.png'
  },
  {
    term: 'Cluster Forking',
    definition: 'A process where nodes within a Cluster decide to eject a specific MXE (e.g., due to undesirable activities), leading to the formation of a new Cluster that supports the ejected MXE independently.',
    category: 'Architecture'
  },
  {
    term: 'Cluster Migration',
    definition: 'The movement of tasks or nodes from one Cluster to another. This can be "Planned" (voluntary exit) or "Forced" (reassignment due to downtime or stake reduction).',
    category: 'Architecture'
  },
  {
    term: 'Computation Customer',
    definition: 'The entity that initiates and commissions computations within the Arcium network. They define the MXE, select clusters, and pay fees for execution.',
    category: 'Network'
  },
  {
    term: 'Epoch',
    definition: 'Fixed-duration timeframes (e.g., several hours or days) that serve as the framework for scheduling computations, distributing rewards, and managing token lock-ups.',
    category: 'Network'
  },
  {
    term: 'Hardware Claim',
    definition: 'A node operator\'s formal declaration of their hardware\'s maximum computational load capacity. This claim must be backed by a corresponding amount of stake to be eligible for work.',
    category: 'Staking',
    link: { label: 'Staking Simulator', url: '/staking' }
  },
  {
    term: 'Manticore',
    definition: 'An "honest but curious" Multi-Party Computation (MPC) protocol supported by Arcium, optimized for performance in environments where nodes are expected to follow the protocol.',
    category: 'Protocols',
    link: { label: 'MPC Visualizer', url: '/visualizer' }
  },
  {
    term: 'Mempool',
    definition: 'The global onchain queue (initially on Solana) where all commissioned computations await execution by designated Clusters of Arx nodes.',
    category: 'Architecture',
    link: { label: 'Mempool Race', url: '/mempool' }
  },
  {
    term: 'MPC (Multi-Party Computation)',
    definition: 'A cryptographic technique that allows multiple parties to jointly compute a function over their inputs while keeping those inputs private. No single party ever see the full data.',
    category: 'Cryptography',
    link: { label: 'MPC Visualizer', url: '/visualizer' },
    imagePath: '/assets/glossary/mpc_icon.png'
  },
  {
    term: 'MXE (MPC eXecution Environment)',
    definition: 'A dedicated, virtualized environment where computations are defined, configured, and securely executed. MXEs include computation logic, data handling rules, and security protocols.',
    category: 'Architecture',
    link: { label: 'MXE Builder', url: '/mxe-builder' }
  },
  {
    term: 'Priority Fee',
    definition: 'A voluntary fee paid by Computation Customers to prioritize their tasks in the mempool, allowing urgent computations to jump the queue for faster execution.',
    category: 'Economics',
    link: { label: 'Mempool Race', url: '/mempool' }
  },
  {
    term: 'Secret Sharing',
    definition: 'A fundamental cryptographic primitive that splits data into multiple "shares" distributed among participants. No single share contains information about the original secret.',
    category: 'Cryptography',
    link: { label: 'Secret Sharing Guide', url: '/learn/secret-sharing' }
  },
  {
    term: 'Slashing',
    definition: 'A security mechanism where a portion of a node\'s staked collateral is permanently removed as a penalty for misbehavior, protocol violations, or extended downtime.',
    category: 'Economics',
    link: { label: 'Staking Simulator', url: '/staking' }
  },
  {
    term: 'Staking',
    definition: 'The process of locking tokens (collateral) to activate an Arx Node. Staking aligns incentives, ensures honesty, and allows nodes to receive computational rewards.',
    category: 'Economics',
    link: { label: 'Staking Simulator', url: '/staking' }
  },
  {
    term: 'Sybil Resistance',
    definition: 'Mechanisms used to prevent a single entity from controlling multiple fake identities. Arcium uses Proof of Stake and Random Node Inclusion to maintain cluster integrity.',
    category: 'Security',
    link: { label: 'Architecture Explorer', url: '/architecture' }
  },
  {
    term: 'TEE (Trusted Execution Environment)',
    definition: 'A secure area of a main processor that provides hardware-level isolation for sensitive computations, offering an additional layer of security for Arx nodes.',
    category: 'Security'
  },
  {
    term: 'Threshold Encryption',
    definition: 'An encryption method that requires a specific "threshold" (minimum number) of authorized parties to collaborate in order to decrypt data, preventing single-point failures.',
    category: 'Cryptography'
  },
  {
    term: 'Third-Party Delegator',
    definition: 'Stakeholders who contribute their tokens to an Arx node operator in exchange for a share of rewards, assuming the risk of slashing if the node misbehaves.',
    category: 'Network',
    link: { label: 'Staking Simulator', url: '/staking' }
  },
  {
    term: 'Trustless Execution',
    definition: 'The ability to execute computations where the integrity and correctness of the outcome are guaranteed by mathematics and cryptography rather than by a central authority.',
    category: 'Security'
  }
];
