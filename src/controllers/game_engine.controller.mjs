import { generateStoryPlot, generateChoiceBasedStoryPlot } from '../utils/adaptive_narration/prompts.mjs';
import prisma from '../utils/prisma_connector.mjs';
import runQuery from '../utils/neo4J_connector.mjs';

export const initGameEngine = async (request, respond) => {
    const { playerId, storyId } = request.body;
    let plot = null;

    // Step 1: Check if the player is already playing the story
    const storyData = await runQuery(`MATCH (p:Player {id: "${playerId}"})-[:PLAYING]->(s:Story {id: "${storyId}"}) RETURN s`);
    if (storyData.records.length > 0) {
        // If the player is already playing the story, then return the plot that is CURRENTLY_AT the story.
        const plotData = await runQuery(`MATCH (s:Story {id: "${storyId}"})-[:CURRENTLY_AT]->(p:Plot) RETURN p`);
        plot = plotData.records[0]._fields[0].properties;
        plot.choices = JSON.parse(plot.choices);
    } else {
        // If the player is not playing the story, then initialize the game engine.
        // Step 1: Get the story data from the database
        const story = await prisma.story.findUnique({
            where: { id: storyId }
        });

        // Step 2: Generate the story plot
        plot = await generateStoryPlot(story);

        // Step 3: Link the player to the story in Neo4J. If the story already linked to the player, then return the plot that is CURRENTLY_AT the story.
        await runQuery(`MATCH (p:Player {id: "${playerId}"}), (s:Story {id: "${storyId}"}) MERGE (p)-[:PLAYING]->(s)`);

        // Step 4: Save the plot and link it to the story in Neo4J
        await runQuery(`CREATE (:Plot {id: "${plot.id}", title: "${plot.title}", description: "${plot.description}", imageUrl: "${plot.imageUrl}", hint: "${plot.hint}", createdAt: "${plot.createdAt}", choices: '${JSON.stringify(plot.choices)}'})`);
        await runQuery(`MATCH (s:Story {id: "${storyId}"}), (p:Plot {id: "${plot.id}"}) MERGE (s)-[:HAS]->(p) MERGE (s)-[:CURRENTLY_AT]->(p)`);
    }

    // Step 6: Return the plot to the client
    return respond.json({
        message: "Game engine initialized successfully.",
        data: {
            plot: plot
        }
    });
};

export const nextPlot = async (request, respond) => {
    const {storyId, plotId, choiceId} = request.body;

    // Step 1: Fetch the plot from Neo4J
    const plotData = await runQuery(`MATCH (p:Plot {id: "${plotId}"}) RETURN p`);

    // Step 2: Fetch the choice from the plot
    const plot = plotData.records[0]._fields[0].properties;
    plot.choices = JSON.parse(plot.choices);
    const choice = plot.choices.find(choice => choice.id === choiceId);

    // Step 3: Generate the next plot based on the choice
    const nextPlot = await generateChoiceBasedStoryPlot(plot, choice);

    // Step 4: Save the next plot and link it to the plot with relation containing the choice
    await runQuery(`CREATE (:Plot {id: "${nextPlot.id}", title: "${nextPlot.title}", description: "${nextPlot.description}", imageUrl: "${nextPlot.imageUrl}", hint: "${nextPlot.hint}", createdAt: "${nextPlot.createdAt}", choices: '${JSON.stringify(nextPlot.choices)}'})`);
    await runQuery(`MATCH (p:Plot {id: "${plotId}"}), (n:Plot {id: "${nextPlot.id}"}) MERGE (p)-[:LEADS_TO {choiceId: "${choice.id}", name: "${choice.name}"}]->(n)  MERGE (n)-[:PRECEDES]->(p)`);

    // Step 5: Update the story to point to the next plot
    await runQuery(`MATCH (s:Story {id: "${storyId}"})-[r:CURRENTLY_AT]->(p:Plot {id: "${plotId}"}) DELETE r`);
    await runQuery(`MATCH (s:Story {id: "${storyId}"}), (p:Plot {id: "${nextPlot.id}"}) MERGE (s)-[:CURRENTLY_AT]->(p) `);

    // Step 6: Return the next plot to the client
    return respond.json({
        message: "New plot generated successfully.",
        data: {
            plot: nextPlot
        }
    });

}

export const previousPlot = async (request, respond) => {
    const {storyId, plotId} = request.body;

    // Step 1: Fetch the previous plot
    const previousPlotData = await runQuery(`MATCH (p:Plot {id: "${plotId}"})-[:PRECEDES]->(pp:Plot) RETURN pp`);
    const previousPlot = previousPlotData.records[0]._fields[0].properties;
    previousPlot.choices = JSON.parse(previousPlot.choices);

    // Step 2: Update the story to point to the previous plot
    await runQuery(`MATCH (s:Story {id: "${storyId}"})-[r:CURRENTLY_AT]->(p:Plot {id: "${plotId}"}) DELETE r`);
    await runQuery(`MATCH (s:Story {id: "${storyId}"}), (p:Plot {id: "${previousPlot.id}"}) MERGE (s)-[:CURRENTLY_AT]->(p)`);

    // Step 3: Return the previous plot to the client
    return respond.json({
        message: "Previous plot fetched successfully.",
        data: {
            plot: previousPlot
        }
    });

}