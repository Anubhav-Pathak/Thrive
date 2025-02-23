export default class Queries {

    // Admin

    static addPlayerQuery = `
        CREATE (p:Player {
            id: $id, 
            name: $name
        });
    `;
    static addStoryQuery = `
        CREATE (s:Story {
            id: $id, 
            title: $title
        });
    `;
    static deletePlayerQuery = `
        MATCH (p:Player {id: $playerId}) DETACH DELETE p;
    `;
    static deleteStoryQuery = `
        MATCH (s:Story {id: $storyId}) DETACH DELETE s;
    `;

    // Game

    static getCurrentPlotQuery = `
        MATCH (p:Player {id: $playerId})-[:PLAYING]->(s:Story {id: $storyId})-[:CURRENTLY_AT]->(pl:Plot) 
        RETURN pl;
    `;
    static newStoryQuery = `
        MATCH (p:Player {id: $playerId}), (s:Story {id: $storyId}) 
        MERGE (p)-[:PLAYING]->(s)
        CREATE (pl:Plot {
            id: $plotId, 
            title: $title, 
            description: $description, 
            choices: $choices 
        }) 
        MERGE (s)-[:HAS]->(pl)
        MERGE (s)-[:CURRENTLY_AT]->(pl);
    `;
    static newPlotQuery = `
        MATCH (p:Player {id: $playerId})-[:PLAYING]->(s:Story {id: $storyId})-[c:CURRENTLY_AT]->(pp:Plot) 
        CREATE (np:Plot {
            id: $newPlotId, 
            title: $newTitle, 
            description: $newDescription, 
            choices: $newChoices 
        }) 
        MERGE (pp)-[:LEADS_TO {id: $choiceId, title: $choiceTitle}]->(np)
        MERGE (np)-[:PRECEDES]->(pp)
        DELETE c
        CREATE (s)-[:CURRENTLY_AT]->(np);
    `;
    static previousPlotQuery = `
        MATCH (p:Player {id: $playerId})-[:PLAYING]->(s:Story {id: $storyId})-[c:CURRENTLY_AT]->(pl:Plot)-[:PRECEDES]->(pp:Plot)
        DELETE c
        CREATE (s)-[:CURRENTLY_AT]->(pp)
        RETURN pp;
    `;
}