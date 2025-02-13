class Story {
  constructor(id, title, description, imageUrl, type, status, createdAt, lastPlayedAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
    this.lastPlayedAt = lastPlayedAt;
  }

  static fromJson(json) {
    return new Story(
      json['id'],
      json['title'],
      json['description'],
      json['image_url'],
      json['type'],
      json['status'],
      new Date(json['created_at']),
      json['last_played_at'] ? new Date(json['last_played_at']) : null
    );
  }

  toJson() {
    return {
      'id': this.id,
      'title': this.title,
      'description': this.description,
      'image_url': this.imageUrl,
      'type': this.type,
      'status': this.status,
      'created_at': this.createdAt.toISOString(),
      'last_played_at': this.lastPlayedAt ? this.lastPlayedAt.toISOString() : null
    };
  }
}