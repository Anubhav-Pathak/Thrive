import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Neo4JService from '../../utils/db/neo4J/service';
import GeminiAgent from '../../utils/ai_agent/gemini_agent';
import Player from '../models/player';
import { Status } from '../models/story';

export default class AdminController {
    private static instance: AdminController;
    prisma: PrismaClient;
    graphDb: Neo4JService;
    agent: GeminiAgent;

    private constructor() {
        this.prisma = new PrismaClient();
        this.graphDb = Neo4JService.getInstance();
        this.agent = GeminiAgent.getInstance();
    }

    static getInstance() {
        if (!AdminController.instance) {
            AdminController.instance = new AdminController();
        }
        return AdminController.instance;
    }

    addPlayer = async (req: Request, res: Response) : Promise<void> => {
        const { name } = req.body;
        const player = await this.prisma.player.create({
            data: {
                name,
            }
        });
        await this.graphDb.addPlayer(new Player(player.id, player.name));
        res.json({
            message: 'Player added',
        });
    }

    addStory = async (req: Request, res: Response) : Promise<void> => {
        const { title, description, type } = req.body;
        const story = await this.prisma.story.create({
            data: {
                title,
                description,
                type,
                status: Status.notStarted,
                createdAt: new Date(),
                lastPlayedAt: null,
            }
        });
        await this.graphDb.addStory(story);
        res.json({
            message: 'Story added',
        });
    }

    deletePlayer = async (req: Request, res: Response) : Promise<void> => {
        const { id } = req.params;
        await this.prisma.player.delete({
            where: {
                id,
            }
        });
        await this.graphDb.deletePlayer(id);
        res.json({
            message: 'Player deleted',
        });
    }

    deleteStory = async (req: Request, res: Response) : Promise<void> => {
        const { id } = req.params;
        await this.prisma.story.delete({
            where: {
                id,
            }
        });
        await this.graphDb.deleteStory(id);
        res.json({
            message: 'Story deleted',
        });
    }
}
