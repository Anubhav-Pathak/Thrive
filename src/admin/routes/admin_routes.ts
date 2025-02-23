import {Router} from 'express';
import AdminController from '../controllers/admin.controller';

const adminRouter = Router();
const adminController = AdminController.getInstance();

adminRouter.post('/add-player', adminController.addPlayer);
adminRouter.post('/add-story', adminController.addStory);
adminRouter.delete('/delete-player/:id', adminController.deletePlayer);
adminRouter.delete('/delete-story/:id', adminController.deleteStory);

export default adminRouter;