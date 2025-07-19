export type Secret = {
  id: string;
  name: string;
  type: 'password' | 'apiKey';
  value: string;
  createdAt: string; // ISO date string
  // Optional metadata for generation context
  serviceDescription?: string;
  accessLevel?: string;
  length?: number;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
};
