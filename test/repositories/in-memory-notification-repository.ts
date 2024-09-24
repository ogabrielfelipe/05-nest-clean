import type { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(notificationId: string) {
    const notification = this.items.find(
      (item) => item.id.toString() === notificationId,
    )

    return notification ?? null
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const index = this.items.findIndex((item) => item.id === notification.id)

    this.items[index] = notification
  }
}
