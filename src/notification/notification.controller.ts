import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  PaginationQueryDto,
  SearchPaginationQueryDto,
  UpdateNotificationDto,
} from '@dad-group-1/backend-common';

@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'create_notification' })
  async createNotification(@Payload() data: CreateNotificationDto) {
    this.logger.log('Received create notification record');
    return this.notificationService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_notifications' })
  async findAllNotifications(@Payload() data: PaginationQueryDto) {
    this.logger.log('Received find all notifications request');
    return this.notificationService.findAll(data);
  }

  @MessagePattern({ cmd: 'find_all_notifications_for_user' })
  async findAllNotificationsForUser(
    @Payload() searchPagination: SearchPaginationQueryDto,
  ) {
    this.logger.log('Received find all notifications for user request');
    return this.notificationService.findAllForUser(searchPagination);
  }

  @MessagePattern({ cmd: 'find_one_notification' })
  async findOneNotification(@Payload() id: string) {
    this.logger.log('Received find one notification request for id: ' + id);
    return this.notificationService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_notification' })
  async updateNotification(
    @Payload() payload: { id: string; updateData: UpdateNotificationDto },
  ) {
    this.logger.log(
      'Received update notification request for id: ' + payload.id,
    );
    return this.notificationService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_notification' })
  async removeNotification(@Payload() id: string) {
    this.logger.log('Received remove notification request for id: ' + id);
    return this.notificationService.remove(id);
  }
}
