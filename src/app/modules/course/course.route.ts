import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post(
  '/',
  auth('admin'),
  validateRequest(CourseValidations.createCourseSchemaZod),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);
router.get('/:courseId/reviews', CourseControllers.singleCourse);
router.put(
  '/:courseId',
  auth('admin'),
  validateRequest(CourseValidations.updateCourseSchemaZod),
  CourseControllers.updateCourse,
);

export const CoursesRoutes = router;
