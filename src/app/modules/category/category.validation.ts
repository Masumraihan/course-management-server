import { z } from 'zod';

const categoryValidationsSchema = z.object({
  name: z.string(),
});

export const CategoryValidations = {
  categoryValidationsSchema,
};
