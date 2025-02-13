class Plot {
    constructor(id, title, description, imageUrl, isLast, choices, hint, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.isLast = isLast;
        this.choices = choices;
        this.hint = hint;
        this.createdAt = createdAt;
    }

    static fromJson(json) {
        return new Plot(
            json['id'],
            json['title'],
            json['description'],
            json['image_url'],
            json['is_last'],
            json['choices'] ? json['choices'].map(choice => Choice.fromJson(choice)) : null,
            json['hint'],
            new Date(json['created_at'])
        );
    }

    toJson() {
        return {
            'id': this.id,
            'title': this.title,
            'description': this.description,
            'image_url': this.imageUrl,
            'is_last': this.isLast,
            'choices': this.choices ? this.choices.map(choice => choice.toJson()) : null,
            'hint': this.hint,
            'created_at': this.createdAt.toISOString()
        };
    }
}