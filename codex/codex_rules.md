# Codex Development Rules

This project is an interactive learning platform for the Arcium Network.

The goal is to visually teach complex cryptographic infrastructure concepts such as:

- Multi Party Computation (MPC)
- Secret sharing
- MXEs
- Clusters
- Arx Nodes
- Sybil resistance
- Cluster migration
- Cluster forking

The implementation must follow these requirements.

TECH STACK

Framework:
Next.js (React)

Styling:
TailwindCSS

Animation:
Framer Motion

Visualization:
D3.js

State management:
Zustand

Rendering requirements:

Network diagrams must use SVG.

Simulation logic must be separated from rendering.

Visualization components must live inside:

/src/components/visualizations

Simulation state must live inside:

/src/simulation

Pages must live inside:

/src/app

All educational explanations must be written as markdown files inside:

/content

The system must be designed so additional Arcium concepts can be added later.

The platform must prioritize:

clarity
visual explanation
interactive learning
step-by-step simulation
