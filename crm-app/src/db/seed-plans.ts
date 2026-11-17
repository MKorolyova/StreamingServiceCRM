export const SEED_PLANS = [
  { name: "Basic", monthlyPriceCents: 799, maxStreams: 1, maxProfiles: 1, resolution: "SD" },
  { name: "Standard", monthlyPriceCents: 1299, maxStreams: 2, maxProfiles: 2, resolution: "HD" },
  { name: "Premium", monthlyPriceCents: 1799, maxStreams: 4, maxProfiles: 4, resolution: "FULL_HD" },
  { name: "Family", monthlyPriceCents: 2299, maxStreams: 6, maxProfiles: 6, resolution: "ULTRA_HD" },
] as const;
