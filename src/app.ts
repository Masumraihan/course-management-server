import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFoundError from './app/middlewares/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Course-review ❤️');
});

app.use('/api', router);

// ERROR HANDLER
app.use(notFoundError);
app.use(globalErrorHandler);

export default app;
