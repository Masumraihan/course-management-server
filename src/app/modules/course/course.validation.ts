import { z } from 'zod';

// Define Zod schema for TTags
const createTagsSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});
const updateTagsSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean(),
});

// Define Zod schema for TDetails
const createDetailsSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string(),
});
const updateDetailsSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  description: z.string().optional(),
});

// Define Zod schema for TCourse
export const createCourseSchemaZod = z.object({
  title: z.string().min(1),
  instructor: z.string().min(1),
  categoryId: z.string(),
  price: z.number().positive(),
  tags: z.array(createTagsSchema).nonempty(),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  details: createDetailsSchema,
});
export const updateCourseSchemaZod = z.object({
  title: z.string().min(1).optional(),
  instructor: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  price: z.number().positive().optional().optional(),
  tags: z.array(updateTagsSchema).nonempty().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  language: z.string().optional(),
  provider: z.string().optional(),
  details: updateDetailsSchema.optional(),
});

export const CourseValidations = {
  createCourseSchemaZod,
  updateCourseSchemaZod,
};
