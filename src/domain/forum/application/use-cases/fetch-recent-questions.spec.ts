import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: FetchRecentQuestionsUseCase
// system under test

describe('Fetch recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it(' should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 25) }),
    )

    const { value } = await sut.execute({
      page: 1,
    })

    expect(value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 25) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it(' should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { value } = await sut.execute({
      page: 2,
    })

    expect(value?.questions).toHaveLength(2)
  })
})
