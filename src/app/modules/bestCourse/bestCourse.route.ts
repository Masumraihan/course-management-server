import express from 'express';
import { BestCourseControllers } from './bestCourse.controller';

const router = express.Router();

router.get('/best', BestCourseControllers.bestCourse);

export const BestCourseRoutes = router;
