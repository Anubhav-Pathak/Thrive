import {Router} from 'express';
import { initGameEngine, nextPlot, previousPlot } from '../controllers/game_engine.controller.mjs';

const gameEngineRouter = Router();

gameEngineRouter.post('/init', initGameEngine);
gameEngineRouter.post('/next', nextPlot);
gameEngineRouter.post('/previous', previousPlot);

export default gameEngineRouter;