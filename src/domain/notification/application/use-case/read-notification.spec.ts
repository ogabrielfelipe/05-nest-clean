import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification-repository'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase
// system under test

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = makeNotification(
      {},
      new UniqueEntityId('notification-id-01'),
    )

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: 'notification-id-01',
      recipientId: newNotification.recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to read a notification another user', async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityId('recipient-id-01'),
      },
      new UniqueEntityId('notification-id-01'),
    )

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: 'notification-id-01',
      recipientId: 'recipient-id-02',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
