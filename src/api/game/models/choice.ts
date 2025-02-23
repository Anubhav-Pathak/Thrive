import { v4 as uuid } from 'uuid';

export default class Choice {
    id: string;
    title: string;
    
    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }

    static fromJson(data: string): Choice {
        return new Choice(uuid(), data);
    }
}