import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: FetchAnswerCommentsUseCase
// system under test

describe('Fetch Comments By Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it(' should be able to fetch comments by Answer', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({}, new UniqueEntityId('answer-id-01')),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-id-01'),
      }),
    )

    const { value } = await sut.execute({
      page: 1,
      answerId: 'answer-id-01',
    })

    expect(value?.answerComments).toEqual([
      expect.objectContaining({
        answerId: new UniqueEntityId('answer-id-01'),
      }),
    ])
  })

  it(' should be able to fetch paginated comments by answer', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({}, new UniqueEntityId('answer-id-01')),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-id-01'),
        }),
      )
    }

    const { value } = await sut.execute({
      page: 2,
      answerId: 'answer-id-01',
    })

    expect(value?.answerComments).toHaveLength(2)
  })
})
