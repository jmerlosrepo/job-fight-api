export type FighterApplication = {
  fighterApplicationId: number;
  userId: number;
  jobId: number;
  isSelected: boolean;
  applicationDate: Date;
  assignmentDate: Date | null;
};
