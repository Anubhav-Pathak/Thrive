class Game {
    constructor(player, story, currentPlot) {
        this.player = player;
        this.story = story;
        this.currentPlot = currentPlot;
    }

    static fromJson(json) {
        return new Game(
            Player.fromJson(json['player']),
            Story.fromJson(json['story']),
            Plot.fromJson(json['currentPlot'])
        );
    }

    toJson() {
        return {
            'player': this.player.toJson(),
            'story': this.story.toJson(),
            'currentPlot': this.currentPlot.toJson()
        };
    }
}