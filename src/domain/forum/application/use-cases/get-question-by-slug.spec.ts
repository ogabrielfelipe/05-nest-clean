import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { makeAttachment } from 'test/factories/make-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase
// system under test

describe('Find a Question by Slug', () => {
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

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it(' should be able to get a question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    await inMemoryStudentsRepository.items.push(student)

    const attachment1 = makeAttachment({
      title: 'Some attachment 1',
    })

    const attachment2 = makeAttachment({
      title: 'Some attachment 2',
    })

    await inMemoryAttachmentsRepository.items.push(attachment1)
    await inMemoryAttachmentsRepository.items.push(attachment2)

    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const questionAttachment1 = makeQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: newQuestion.id,
    })

    const questionAttachment2 = makeQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: newQuestion.id,
    })

    await inMemoryQuestionAttachmentsRepository.items.push(questionAttachment1)
    await inMemoryQuestionAttachmentsRepository.items.push(questionAttachment2)

    const { value } = await sut.execute({
      slug: 'example-question',
    })

    expect(value).toBeTruthy()
    expect(value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment 1',
          }),
          expect.objectContaining({
            title: 'Some attachment 2',
          }),
        ],
      }),
    })
  })

  it(' should not be able to get a question by slug that does not exist ', async () => {
    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
