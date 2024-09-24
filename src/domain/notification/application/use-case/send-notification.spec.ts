import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase
// system under test

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it(' should be able to create a notification', async () => {
    const { value } = await sut.execute({
      title: 'Nova pergunta',
      content: 'this is a new notification',
      recipientId: '1',
    })

    expect(value?.notification.id).toBeTruthy()
  })
})
