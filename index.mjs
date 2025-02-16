import dotenv from 'dotenv';
import express from 'express';
import gameEngineRouter from './src/routes/game_engine_routes.mjs';
import discoverRouter from './src/routes/discover_routes.mjs';

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/game', gameEngineRouter);
app.use('/api/discover', discoverRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});