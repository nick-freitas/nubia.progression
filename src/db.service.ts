import { Chapter, Gamebook, Progression, User } from '@indigobit/nubia.common';
import { Injectable } from '@nestjs/common';

// Use JSON file for storage
export type DbData = {
  users: User[];
  gamebooks: Gamebook[];
  chapters: Chapter[];
  progressions: Progression[];
};

@Injectable()
export class DBService {
  readonly db: { data: DbData };

  get users() {
    return this.db.data.users;
  }

  get gamebooks() {
    return this.db.data.gamebooks;
  }

  get chapters() {
    return this.db.data.chapters;
  }

  get progressions() {
    return this.db.data.progressions;
  }

  constructor() {
    this.db = {
      data: { users: [], gamebooks: [], chapters: [], progressions: [] },
    };
  }
}
