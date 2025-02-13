import dummyData from '../../assets/data/dummy_data.json' assert { type: "json" };

export const initGameEngine = (request, respond) => {
    const player = request.body.player;
    const story = request.body.story;
    
    // TODO: Check if player has already played the story else create a new game

    return respond.json(dummyData);
};