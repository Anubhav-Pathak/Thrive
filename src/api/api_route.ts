import {Router} from 'express';
import gameRouter from './game/routes/game_routes';

const apiRouter = Router();

apiRouter.use('/game', gameRouter);

export default apiRouter;