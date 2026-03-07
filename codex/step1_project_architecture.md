Build the foundation architecture for an interactive educational platform that teaches the Arcium Network.

The system must visually explain complex cryptographic infrastructure.

Primary concepts include:

MPC
secret sharing
MXEs
clusters
Arx nodes
sybil resistance
cluster migration
cluster forking

Use the documentation reference provided in the codex folder.

The application must include:

1. Home page
2. Interactive MPC visualizer
3. Arcium architecture explorer
4. Concept learning pages
5. Simulation engine

TECH STACK

Next.js
React
TailwindCSS
Framer Motion
D3.js
Zustand

DIRECTORY STRUCTURE

/src

components
components/visualizations

simulation

lib

content

pages

VISUALIZATION REQUIREMENTS

Nodes must be represented as circles.

Connections must represent secret share communication.

Clusters must visually group nodes.

Secret shares must be animated moving between nodes.

Simulation must be step based.

Example steps:

user submits encrypted input
data splits into secret shares
shares distribute to nodes
nodes compute partial result
cluster reconstructs result

Create placeholder pages and components for the full system.

Do not implement all simulation logic yet.

Focus on building the architecture and reusable components.
