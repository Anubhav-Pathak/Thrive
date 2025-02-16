import { v4 as uuid } from 'uuid';
import Plot from '../../models/game_engine/plot.mjs';
import Choice from '../../models/game_engine/choice.mjs';


export const plotConverter = (data) => {

    const choices = data.choices.map(choice => {
        return new Choice(
            uuid(),
            choice,
        )
    });
    
    return new Plot(
        uuid(),
        data.title,
        data.description,
        null,
        choices,
        null,
        new Date()
    );
}