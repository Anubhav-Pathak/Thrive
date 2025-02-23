import Story from "../../../admin/models/story";
import Choice from "../../../api/game/models/choice";
import Plot from "../../../api/game/models/plot";
import Neo4JConnector from "./connector";
import Queries from "./queries";


export default class Neo4JService {
    private static instance : Neo4JService;
    private connector : Neo4JConnector;

    private constructor() {
        this.connector = Neo4JConnector.getInstance();
    }

    static getInstance() : Neo4JService {
        if (!Neo4JService.instance) {
            Neo4JService.instance = new Neo4JService();
        }
        return Neo4JService.instance;
    }

    // Admin

    addPlayer = async (player: any) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.addPlayerQuery, { id: player.id, name: player.name });
        await this.connector.closeSession(session);
    }

    addStory = async (story: Story) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.addStoryQuery, { 
            id: story.id, 
            title: story.title, 
        });
        await this.connector.closeSession(session);
    }

    deletePlayer = async (playerId: string) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.deletePlayerQuery, { playerId });
        await this.connector.closeSession(session);
    }

    deleteStory = async (storyId: string) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.deleteStoryQuery, { storyId });
        await this.connector.closeSession(session);
    }


    // Game

    getCurrentPlot = async (playerId: string, storyId: string) : Promise<any> => {
        const session = await this.connector.openSession();
        const result = await this.connector.runQuery(session, Queries.getCurrentPlotQuery, { playerId, storyId });
        await this.connector.closeSession(session);
        if (result.length === 0) {
            return null;
        }
        return result[0].pl.properties;
    }

    newStory = async (playerId: string, storyId: string, plot: Plot) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.newStoryQuery, { 
            playerId,
            storyId,
            plotId: plot.id, 
            title: plot.title, 
            description: plot.description, 
            choices: JSON.stringify(plot.choices), 
        });
        await this.connector.closeSession(session);
    }

    newPlot = async (playerId: string, storyId: string, plot: Plot, choice: Choice) : Promise<void> => {
        const session = await this.connector.openSession();
        await this.connector.runQuery(session, Queries.newPlotQuery, { 
            playerId,
            storyId,
            newPlotId: plot.id, 
            newTitle: plot.title, 
            newDescription: plot.description, 
            newChoices: JSON.stringify(plot.choices),
            choiceId: choice.id,
            choiceTitle: choice.title
        });
        await this.connector.closeSession(session);
    }

    previousPlot = async (playerId: string, storyId: string) : Promise<any> => {
        const session = await this.connector.openSession();
        const result = await this.connector.runQuery(session, Queries.previousPlotQuery, { playerId, storyId });
        await this.connector.closeSession(session);
        return result[0].pp.properties;
    }

}