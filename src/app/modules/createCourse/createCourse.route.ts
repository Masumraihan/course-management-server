import express from 'express';
import { CourseValidations } from '../course/course.validation';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from '../course/course.controller';


const router = express.Router();

router.post(
  '/',
  validateRequest(CourseValidations.createCourseSchemaZod),
  CourseControllers.createCourse,
);


export const CreateCourseRoute = router;
