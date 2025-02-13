import {Router} from 'express';
import { initGameEngine } from '../controllers/game_engine.controller.mjs';

const gameEngineRouter = Router();

gameEngineRouter.post('/init', initGameEngine);

export default gameEngineRouter;