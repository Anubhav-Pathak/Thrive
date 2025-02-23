import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import apiRouter from './src/api/api_route';
import adminRouter from './src/admin/routes/admin_routes';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRouter);
app.use('/admin', adminRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});