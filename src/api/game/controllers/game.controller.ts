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
        let plot = null;

        const existingPlot = await this.graphDb.getExistingPlot(playerId, storyId, choiceId);

        if (existingPlot) {
            plot = Plot.fromJson(existingPlot);
        } else {
            let currentPlot = await this.graphDb.getCurrentPlot(playerId, storyId);
            currentPlot = Plot.fromJson(currentPlot);
            const choice = currentPlot.choices.find((c: any) => c.id === choiceId);
    
            const response = await this.agent.generateContent(Prompts.nextPlotPrompt(currentPlot, choice));
            const data = this.agent.parse(response);
    
            plot = Plot.fromJson(data);
    
            await this.graphDb.newPlot(playerId, storyId, plot, choice);
        }
        res.json({
            message: 'Next Plot Generated',
            data: plot
        });
    }

    previous = async (req: Request, res: Response) => {
        const { playerId, storyId } = req.body;

        let previousPlot = await this.graphDb.previousPlot(playerId, storyId);
        previousPlot = Plot.fromJson(previousPlot);

        res.json({
            message: 'Previous Plot Generated',
            data: previousPlot
        });
    }
}