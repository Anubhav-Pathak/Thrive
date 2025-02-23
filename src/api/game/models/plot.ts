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
        return new Plot(
            data.id || uuid(),
            data.title,
            data.description,
            typeof data.choices === 'string' ? data.choices = JSON.parse(data.choices) : data.choices.map((c: any) => Choice.fromJson(c))
        );
    }
}