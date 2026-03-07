export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
}

export const topics: Topic[] = [
  {
    id: 'mpc',
    title: 'Multi-Party Computation',
    slug: 'mpc',
    description: 'Learn how multiple nodes can jointly compute a function over their inputs while keeping those inputs private.',
    order: 1,
  },
  {
    id: 'secret-sharing',
    title: 'Secret Sharing',
    slug: 'secret-sharing',
    description: 'Understand how data is mathematically split into shares so no individual node holds the original information.',
    order: 2,
  },
  {
    id: 'clusters',
    title: 'Arcium Clusters',
    slug: 'clusters',
    description: 'Explore how Arx nodes form dynamic clusters to securely execute computations with sybil resistance.',
    order: 3,
  },
  {
    id: 'mxes',
    title: 'Multipass Execution Environments (MXEs)',
    slug: 'mxes',
    description: 'Discover the secure off-chain execution environments that power the Arcium network.',
    order: 4,
  }
];
