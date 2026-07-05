import { z } from 'zod';

export const companySaveSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  cnpj: z.string().min(1, 'CNPJ is required')
});

export type TCompanySaveSchema = z.infer<typeof companySaveSchema>;
