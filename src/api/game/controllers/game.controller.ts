import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Plot from '../models/plot';
import Prompts from '../../../utils/ai_agent/prompts';
import GeminiAgent from '../../../utils/ai_agent/gemini_agent';
import Neo4JService from '../../../utils/db/neo4J/service';

export default class GameController {
    private static instance: GameController;
    prisma: PrismaClient;
    graphDb: Neo4JService;
    agent: GeminiAgent;

    private constructor() {
        this.prisma = new PrismaClient();
        this.graphDb = Neo4JService.getInstance();
        this.agent = GeminiAgent.getInstance();
    }

    static getInstance() {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }

    init = async (req: Request, res: Response) : Promise<void> => {
        const { playerId, storyId } = req.body;
        let plot = null;

        const currentPlot = await this.graphDb.getCurrentPlot(playerId, storyId);

        if(currentPlot) {
            currentPlot.choices = JSON.parse(currentPlot.choices);
            plot = Plot.fromJson(currentPlot);
        } else {
            const story = await this.prisma.story.findUnique({
                where: {
                    id: storyId
                }
            }) as any;

            const response = await this.agent.generateContent(Prompts.startingPlotPrompt(story));
            const data = this.agent.parse(response);

            plot = Plot.fromJson(data);

            await this.graphDb.newStory(playerId, storyId, plot);
        }
        res.json({
            message: 'Game Engine Initialized',
            data: plot
        });
    }

    next = async (req: Request, res: Response) => {
        const { playerId, storyId, choiceId } = req.body;

        const currentPlot = await this.graphDb.getCurrentPlot(playerId, storyId);
        currentPlot.choices = JSON.parse(currentPlot.choices);
        const choice = currentPlot.choices.find((c: any) => c.id === choiceId);

        const response = await this.agent.generateContent(Prompts.nextPlotPrompt(currentPlot, choice));
        const data = this.agent.parse(response);

        const newPlot = Plot.fromJson(data);

        await this.graphDb.newPlot(playerId, storyId, newPlot, choice);

        res.json({
            message: 'Next Plot Generated',
            data: newPlot
        });
    }

    previous = async (req: Request, res: Response) => {
        const { playerId, storyId } = req.body;

        const previousPlot = await this.graphDb.previousPlot(playerId, storyId);
        previousPlot.choices = JSON.parse(previousPlot.choices);
        const plot = Plot.fromJson(previousPlot);

        res.json({
            message: 'Previous Plot Generated',
            data: plot
        });
    }
}