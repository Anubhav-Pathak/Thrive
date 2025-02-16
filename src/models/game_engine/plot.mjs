export default class Plot {
    constructor(id, title, description, imageUrl, choices, hint, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.choices = choices;
        this.hint = hint;
        this.createdAt = createdAt;
    }
}