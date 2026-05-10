export type Market = {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  endDate: string;
  resolved: boolean;
  yesShares: number;
  noShares: number;
};
