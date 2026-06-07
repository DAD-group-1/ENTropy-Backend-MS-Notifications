import {HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {isValidObjectId, Model} from 'mongoose';
import {RpcException} from '@nestjs/microservices';
import {
    CreateNotificationDto,
    GetNotificationListResponseDto,
    GetNotificationResponseDto,
    PaginationQueryDto,
    SearchPaginationQueryDto,
    UpdateNotificationDto,
} from '@dad-group-1/backend-common';
import {Notification} from './schema/notification.schema';
import {plainToInstance} from 'class-transformer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(createData: CreateNotificationDto): Promise<Notification> {
    try {
      return await this.notificationModel.create(createData);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.logger.error(`Failed to create notification: ${message}`);

      throw new RpcException({
        message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<GetNotificationListResponseDto> {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.notificationModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.notificationModel.countDocuments(),
    ]);

    const dtoItems = items.map((item) =>
      plainToInstance(GetNotificationResponseDto, item),
    );

    return new GetNotificationListResponseDto(dtoItems, total, page, limit);
  }

  async findAllForUser(
    searchQuery: SearchPaginationQueryDto,
  ): Promise<GetNotificationListResponseDto> {
    const { id, query: pagination } = searchQuery;
    const { page = 1, limit = 10 } = pagination;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.notificationModel
        .find({ user_id: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      this.notificationModel.countDocuments({ user_id: id }),
    ]);

    const dtoItems = items.map((item) =>
      plainToInstance(GetNotificationResponseDto, item),
    );

    return new GetNotificationListResponseDto(dtoItems, total, page, limit);
  }

  async findOne(id: string): Promise<Notification> {
    this.assertValidId(id);

    const notification = await this.notificationModel.findById(id).exec();

    if (!notification) {
      this.logger.error(`Notification with ID ${id} not found`);

      throw new RpcException({
        message: `Notification with ID ${id} not found`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return notification;
  }

  async update(
    id: string,
    updateData: UpdateNotificationDto,
  ): Promise<Notification> {
    this.assertValidId(id);

    const updated = await this.notificationModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
      })
      .exec();

    if (!updated) {
      this.logger.error(`Notification with ID ${id} not found for update`);

      throw new RpcException({
        message: `Notification with ID ${id} not found for update`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return updated;
  }

  async remove(id: string): Promise<Notification> {
    this.assertValidId(id);

    const deleted = await this.notificationModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      this.logger.error(`Notification with ID ${id} not found for deletion`);

      throw new RpcException({
        message: `Notification with ID ${id} not found for deletion`,
        code: HttpStatus.NOT_FOUND,
      });
    }

    return deleted;
  }

  private assertValidId(id: string): void {
    if (!isValidObjectId(id)) {
      this.logger.error(`Invalid ObjectId: ${id}`);

      throw new RpcException({
        message: `Invalid notification id`,
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
