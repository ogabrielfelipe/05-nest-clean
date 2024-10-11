import { InMemoryQuestionCommentsRepository } from './../../../../../test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: FetchQuestionCommentsUseCase
// system under test

describe('Fetch Comments By Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it(' should be able to fetch comments by Question', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.items.push(student)

    await inMemoryQuestionsRepository.create(
      makeQuestion(
        {
          authorId: student.id,
        },
        new UniqueEntityId('question-id-01'),
      ),
    )

    const comment = makeQuestionComment({
      questionId: new UniqueEntityId('question-id-01'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment)

    const { value } = await sut.execute({
      page: 1,
      perPage: 10,
      questionId: 'question-id-01',
    })

    expect(value?.comments).toHaveLength(1)
    expect(value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorId: student.id,
          commentId: comment.id,
        }),
      ]),
    )
  })

  it(' should be able to fetch paginated comments by question', async () => {
    const student = makeStudent()

    inMemoryStudentsRepository.items.push(student)

    await inMemoryQuestionsRepository.create(
      makeQuestion(
        { authorId: student.id },
        new UniqueEntityId('question-id-01'),
      ),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-id-01'),
          authorId: student.id,
        }),
      )
    }

    const { value } = await sut.execute({
      page: 2,
      perPage: 10,
      questionId: 'question-id-01',
    })

    expect(value?.comments).toHaveLength(2)
    expect(value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorId: student.id,
        }),
      ]),
    )
  })
})
