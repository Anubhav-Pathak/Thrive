import {Router} from 'express';
import GameController from '../controllers/game.controller';


const gameRouter = Router();
const gameController = GameController.getInstance();

gameRouter.post('/init', gameController.init);
gameRouter.post('/next', gameController.next);
gameRouter.post('/previous', gameController.previous);

export default gameRouter;