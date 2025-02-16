import {Router} from 'express';
import { addPlayer, addStory, deletePlayer, deleteStory } from '../controllers/discover.controller.mjs';

const discoverRouter = Router();

discoverRouter.post('/add-player', addPlayer);
discoverRouter.post('/add-story', addStory);
discoverRouter.delete('/delete-player/:id', deletePlayer);
discoverRouter.delete('/delete-story/:id', deleteStory);

export default discoverRouter;