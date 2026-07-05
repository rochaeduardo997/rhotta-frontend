export interface ProcessFormData {
  title: string;
  area: string;
  seniority: string;
  description: string;
  hardSkills: string[];
  softSkills: string[];
  experienceExpected: string;
  desiredEducation: string;
}

export type ApplicantMode = 'existing' | 'new';

export type StepType = 1 | 2 | 3 | 4 | 5;
