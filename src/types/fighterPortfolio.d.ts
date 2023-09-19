export type FighterPortfolio = {
  fighterPortfolioId: number;
  userId: number;
  portfolioName: string;
  company: string | null;
  contactName: string;
  contactEmail: string | null;
  contactNumber: string;
  description: string;
  link: string | null;
  portfolioActive: boolean;
  datePublished: Date;
  startDate: Date;
  endDate: Date | null;
};
