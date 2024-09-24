import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryAnswersRepository } from './../../../../../test/repositories/in-memory-answers-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answers'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sut: FetchQuestionsAnswersUseCase
// system under test

describe('Fetch Answers By Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository)
  })

  it(' should be able to fetch answers by Question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    )

    const { value } = await sut.execute({
      page: 1,
      questionId: 'question-id-01',
    })

    expect(value?.answers).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    ])
  })

  it(' should be able to fetch paginated answers by question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-id-01'),
        }),
      )
    }

    const { value } = await sut.execute({
      page: 2,
      questionId: 'question-id-01',
    })

    expect(value?.answers).toHaveLength(2)
  })
})
