import {
  AddBookToLibraryEvent,
  GamebookCreatedEvent,
  GamebookUpdatedEvent,
  GetUserLibraryEvent,
  isGamebookCreatedEvent,
  isGamebookUpdatedEvent,
  isProgressionCreatedEvent,
  isProgressionUpdatedEvent,
  isUserCreatedEvent,
  isUserUpdatedEvent,
  ProgressionCreatedEvent,
  ProgressionUpdatedEvent,
  RemoveBookFromLibraryEvent,
  Topics,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@indigobit/nubia.common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(Topics.USERS)
  users(
    @Payload()
    { value }: { value: UserCreatedEvent | UserUpdatedEvent },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isUserCreatedEvent(value)) {
      return this.appService.userCreatedHandler(
        data as UserCreatedEvent['data'],
      );
    }
    if (isUserUpdatedEvent(value)) {
      return this.appService.userUpdatedHandler(
        data as UserUpdatedEvent['data'],
      );
    }

    console.log(`Ignoring ${type}`);
  }

  @MessagePattern(Topics.GAMEBOOKS)
  gamebooks(
    @Payload()
    {
      value,
    }: {
      value:
        | GamebookCreatedEvent
        | GamebookUpdatedEvent
        | AddBookToLibraryEvent
        | RemoveBookFromLibraryEvent
        | GetUserLibraryEvent;
    },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    console.log(type);

    if (isGamebookCreatedEvent(value)) {
      return this.appService.gamebookCreatedHandler(
        data as GamebookCreatedEvent['data'],
      );
    }
    if (isGamebookUpdatedEvent(value)) {
      return this.appService.gamebookUpdatedHandler(
        data as GamebookUpdatedEvent['data'],
      );
    }

    console.log(`Ignoring ${type}`);
  }

  @MessagePattern(Topics.PROGRESSION)
  progressions(
    @Payload()
    {
      value,
    }: {
      value:
        | GamebookCreatedEvent
        | GamebookUpdatedEvent
        | AddBookToLibraryEvent
        | RemoveBookFromLibraryEvent
        | GetUserLibraryEvent;
    },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    if (isProgressionCreatedEvent(value)) {
      return this.appService.progressionCreatedHandler(
        data as ProgressionCreatedEvent['data'],
      );
    }
    if (isProgressionUpdatedEvent(value)) {
      return this.appService.progressionUpdatedHandler(
        data as ProgressionUpdatedEvent['data'],
      );
    }

    console.log(type);

    console.log(`Ignoring ${type}`);
  }
}
