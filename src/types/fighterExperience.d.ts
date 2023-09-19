export type FighterExperience = {
  fighterExperienceId: number;
  userId: number;
  experienceName: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  companyName: string | null;
  contactName: string;
  contactEmail: string | null;
  contactNumber: string | null;
};
