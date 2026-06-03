import { Controller } from '@nestjs/common';
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
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'create_notification' })
  async createNotification(@Payload() data: CreateNotificationDto) {
    return this.notificationService.create(data);
  }

  @MessagePattern({ cmd: 'find_all_notifications' })
  async findAllNotifications(@Payload() data: PaginationQueryDto) {
    return this.notificationService.findAll(data);
  }

  @MessagePattern({ cmd: 'find_all_notifications_for_user' })
  async findAllNotificationsForUser(
    @Payload() searchPagination: SearchPaginationQueryDto,
  ) {
    return this.notificationService.findAllForUser(searchPagination);
  }

  @MessagePattern({ cmd: 'find_one_notification' })
  async findOneNotification(@Payload() id: string) {
    return this.notificationService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_notification' })
  async updateNotification(
    @Payload() payload: { id: string; updateData: UpdateNotificationDto },
  ) {
    return this.notificationService.update(payload.id, payload.updateData);
  }

  @MessagePattern({ cmd: 'remove_notification' })
  async removeNotification(@Payload() id: string) {
    return this.notificationService.remove(id);
  }
}
