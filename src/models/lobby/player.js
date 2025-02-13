class Player {
  constructor(id, name, level, experience) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.experience = experience;
  }

  static fromJson(json) {
    return new Player(
      json['id'],
      json['name'],
      json['level'],
      json['experience']
    );
  }

  toJson() {
    return {
      'id': this.id,
      'name': this.name,
      'level': this.level,
      'experience': this.experience
    };
  }
}