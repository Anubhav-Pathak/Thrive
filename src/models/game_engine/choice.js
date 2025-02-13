class Choice {
    constructor(id, name, nextPlot) {
        this.id = id;
        this.name = name;
        this.nextPlot = nextPlot;
    }

    static fromJson(json) {
        return new Choice(
            json['id'],
            json['name'],
            json['nextPlot'] ? Plot.fromJson(json['nextPlot']) : null
        );
    }

    toJson() {
        return {
            'id': this.id,
            'name': this.name,
            'nextPlot': this.nextPlot ? this.nextPlot.toJson() : null
        };
    }
}