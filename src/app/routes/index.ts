import express from 'express';
import { CoursesRoutes } from '../modules/course/course.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { BestCourseRoutes } from '../modules/bestCourse/bestCourse.route';
import { AuthRoute } from '../modules/auth/auth.route';

const router = express.Router();

const modulesRoutes = [
  { path: '/auth', route: AuthRoute },
  { path: '/courses', route: CoursesRoutes },
  { path: '/categories', route: CategoryRoutes },
  { path: '/reviews', route: ReviewRoutes },
  { path: '/course', route: BestCourseRoutes },
];

modulesRoutes.forEach(route => router.use(route.path, route.route));

export default router;
