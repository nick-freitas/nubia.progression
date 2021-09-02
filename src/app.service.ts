import {
  Progression,
  ProgressionCreatedEvent,
  ProgressionUpdatedEvent,
  OutOfOrderEventException,
  ProgressionEventType,
} from '@indigobit/nubia.common';
import { BadRequestException } from '@indigobit/nubia.common/build/errors/bad-request.exception';
import { Injectable } from '@nestjs/common';
import { DBService } from './db.service';

@Injectable()
export class AppService {
  constructor(private dBService: DBService) {}

  async progressionCreatedHandler(
    data: ProgressionCreatedEvent['data'],
  ): Promise<Progression> {
    const {
      id,
      name,
      descriptor,
      destinationChapterId,
      sourceChapterId,
      version,
    } = data;

    if (!id) {
      throw new Error('Missing Id');
    }
    if (!version) {
      throw new Error('Missing version');
    }

    const progression: Progression = {
      id,
      name,
      descriptor,
      destinationChapterId,
      sourceChapterId,
      version,
    };

    this.dBService.progressions.push({ ...progression });

    return progression;
  }

  async progressionUpdatedHandler(
    data: ProgressionUpdatedEvent['data'],
  ): Promise<Progression> {
    const { id, version } = data;

    if (!id) {
      throw new Error('Missing Id');
    }
    if (!version) {
      throw new Error('Missing Version');
    }

    const index = this.dBService.progressions.findIndex(
      (progression) => progression.id === id,
    );
    if (index === -1)
      throw new BadRequestException('Bad Id in Progression Update Request');

    const progression = { ...this.dBService.progressions[index] };
    if (progression.version !== version - 1)
      throw new OutOfOrderEventException(
        ProgressionEventType.PROGRESSION_UPDATED,
        progression.version - 1,
        version,
      );

    this.dBService.progressions[index] = {
      ...progression,
      ...data,
      version,
    };

    return progression;
  }
}
