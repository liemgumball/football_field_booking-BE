import { Router } from 'express';
import PingRoutes from './PingRoutes';

const pingRouter = Router();

pingRouter.get('/', PingRoutes.ping);

export default pingRouter;
