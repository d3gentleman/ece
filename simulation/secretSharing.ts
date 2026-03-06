import type { SecretShare } from "@/types/mpcTypes";

export function splitSecret(secret: number, nodes: number): number[] {
  if (!Number.isFinite(secret)) {
    throw new Error("secret must be a finite number");
  }

  if (!Number.isInteger(nodes) || nodes < 1) {
    throw new Error("nodes must be an integer greater than 0");
  }

  if (nodes === 1) {
    return [secret];
  }

  const shares: number[] = [];
  let runningSum = 0;

  for (let index = 0; index < nodes - 1; index += 1) {
    const randomShare = Math.random() * 2000 - 1000;
    shares.push(randomShare);
    runningSum += randomShare;
  }

  shares.push(secret - runningSum);
  return shares;
}

export function reconstructSecret(shares: number[]): number {
  return shares.reduce((sum, share) => sum + share, 0);
}

export function createPlaceholderShares(
  secret: string,
  parties: number,
): SecretShare[] {
  const safeParties = Math.max(1, parties);

  return Array.from({ length: safeParties }, (_, index) => ({
    id: `share-${index + 1}`,
    owner: `party-${index + 1}`,
    value: `${secret || "placeholder"}-fragment-${index + 1}`,
  }));
}
