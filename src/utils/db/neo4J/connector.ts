import neo4j, { Driver, Session } from 'neo4j-driver';
import dotenv from 'dotenv';

export default class Neo4JConnector {
    private static instance: Neo4JConnector;
    private driver: Driver;

    constructor() {
        try {
            dotenv.config();
        
            const neo4jUri = process.env.NEO4J_URI;
            const neo4jUser = process.env.NEO4J_USER;
            const neo4jPassword = process.env.NEO4J_PASSWORD;

            if (!neo4jUri || !neo4jUser || !neo4jPassword) throw new Error('Neo4J environment not set');
            
            this.driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));
        } catch (error) {
            console.error('Error connecting to Neo4J:', error);
            throw error;
        }
    }

    static getInstance(): Neo4JConnector {
        if (!Neo4JConnector.instance) {
            Neo4JConnector.instance = new Neo4JConnector();
        }
        return Neo4JConnector.instance;
    }

    async openSession(): Promise<Session> {
        return this.driver.session();
    }

    async closeSession(session: Session): Promise<void> {
        await session.close();
    }

    async runQuery(session: Session, query: string, params: Record<string, any> = {}): Promise<any> {
        try {
            const result = await session.run(query, params);
            return result.records.map(record => record.toObject());
        } catch (error) {
            await this.closeSession(session);
            console.error('Error running query:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        await this.driver.close();
    }
}
