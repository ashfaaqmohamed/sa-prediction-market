export type Market = {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  company?: string | null;
  ticker?: string | null;
  resolvesUsing?: string | null;
  yesIf?: string | null;
  noIf?: string | null;
  resolutionNotes?: string | null;
  endDate: string;
  resolved: boolean;
  outcome?: string | null;
  yesShares: number;
  noShares: number;
};
