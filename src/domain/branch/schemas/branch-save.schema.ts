import { z } from 'zod';

export const branchSaveSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
  description: z.string().optional()
});

export type TBranchSaveSchema = z.infer<typeof branchSaveSchema>;
