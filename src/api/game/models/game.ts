import Player from "../../../admin/models/player";
import Story from "../../../admin/models/story";
import Impact from "./impact";
import Plot from "./plot";


export default class Game {
    player: Player;
    story: Story;
    currentPlot: Plot;
    impact: Impact | null;

    constructor(player: Player, story: Story, currentPlot: Plot, impact: Impact) {
        this.player = player;
        this.story = story;
        this.currentPlot = currentPlot;
        this.impact = null;
    }

}