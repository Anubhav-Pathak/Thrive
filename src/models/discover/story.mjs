export default class Story {
  constructor(id, title, description, imageUrl, type, status, createdAt, lastPlayedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.type = type;
    this.createdAt = createdAt;
    this.lastPlayedAt = lastPlayedAt;
  }
}