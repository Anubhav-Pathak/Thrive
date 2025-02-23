import Choice from "./choice";
import { v4 as uuid } from 'uuid';

export default class Plot {
    id: string; 
    title: string;
    description: string;
    choices: Choice[];

    constructor(id: string, title: string, description: string, choices: Choice[]) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.choices = choices;
    }

    static fromJson(data: any): Plot {
        const title = data.title;
        const description = data.description;
        const choices = data.choices.map((choice: any) => Choice.fromJson(choice));
        return new Plot(uuid(), title, description, choices);
    }
}