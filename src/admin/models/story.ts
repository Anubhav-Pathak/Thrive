export enum Status {
  notStarted = 'not started',
  inProgress = 'in progress',
  completed = 'completed',
  archived = 'archived',
}

export default class Story {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: Date;
  lastPlayedAt: Date | null;

  constructor(
    id: string,
    title: string,
    description: string,
    type: string,
    status: Status,
    createdAt: Date,
    lastPlayedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
    this.lastPlayedAt = lastPlayedAt;
  }
}