import { InMemoryQuestionCommentsRepository } from './../../../../../test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: FetchQuestionCommentsUseCase
// system under test

describe('Fetch Comments By Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it(' should be able to fetch comments by Question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    )

    const { value } = await sut.execute({
      page: 1,
      questionId: 'question-id-01',
    })

    expect(value?.questionComments).toEqual([
      expect.objectContaining({
        questionId: new UniqueEntityId('question-id-01'),
      }),
    ])
  })

  it(' should be able to fetch paginated comments by question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityId('question-id-01')),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-id-01'),
        }),
      )
    }

    const { value } = await sut.execute({
      page: 2,
      questionId: 'question-id-01',
    })

    expect(value?.questionComments).toHaveLength(2)
  })
})
