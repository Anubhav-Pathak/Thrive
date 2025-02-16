import prisma from "../utils/prisma_connector.mjs";
import runQuery from "../utils/neo4J_connector.mjs";

export const addPlayer = async (req, res) => {
    const { name } = req.body;

    try {
        const player = await prisma.player.create({
            data: {
                name,
            },
        });
        await runQuery(`CREATE (:Player {id: "${player.id}"})`);
        res.status(201).json({ message: 'Player added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add person' });
    }
};

export const addStory = async (req, res) => {
    const { id, title, description, imageUrl, type, lastPlayedAt } = req.body;

    try {
        const story = await prisma.story.create({
            data: {
                id,
                title,
                description,
                imageUrl: imageUrl,
                type,
                createdAt: new Date(),
                lastPlayedAt: lastPlayedAt ? new Date(lastPlayedAt) : new Date(),
            },
        });
        const result = await runQuery(`CREATE (:Story {id: "${story.id}"})`);
        console.log(result);
        res.status(201).json({ message: 'Story added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add story' });
    }
};

export const deletePlayer = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.player.delete({
            where: {
                id,
            },
        });
        await runQuery(`MATCH (p:Player {id: "${id}"}) DETACH DELETE p`);
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete person' });
    }
};

export const deleteStory = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.story.delete({
            where: {
                id,
            },
        });
        await runQuery(`MATCH (s:Story {id: "${id}"}) DETACH DELETE s`);
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete story' });
    }
};