import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.get('/', CourseControllers.getAllCourses);
router.get('/:courseId/reviews', CourseControllers.singleCourse);
router.put(
  '/:courseId',
  validateRequest(CourseValidations.updateCourseSchemaZod),
  CourseControllers.updateCourse,
);

export const CoursesRoutes = router;
