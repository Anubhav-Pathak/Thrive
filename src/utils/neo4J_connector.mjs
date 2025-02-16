import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const runQuery = async (query) => {
    try {
        const result = await session.run(query);
        return result;
    } catch (error) {
        console.error('Error running query:', error);
    }
}

export default runQuery;