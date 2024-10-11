import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: FetchAnswerCommentsUseCase
// system under test

describe('Fetch Comments By Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it(' should be able to fetch comments by Answer', async () => {
    const student = await makeStudent({
      name: 'John Doe',
    })

    await inMemoryStudentsRepository.create(student)

    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          authorId: student.id,
        },
        new UniqueEntityId('answer-id-01'),
      ),
    )

    const comment = makeAnswerComment({
      answerId: new UniqueEntityId('answer-id-01'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment)

    const { value } = await sut.execute({
      page: 1,
      perPage: 10,
      answerId: 'answer-id-01',
    })

    expect(value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment.id,
          authorId: student.id,
        }),
      ]),
    )
  })

  it(' should be able to fetch paginated comments by answer', async () => {
    const student = await makeStudent({
      name: 'John Doe',
    })

    await inMemoryStudentsRepository.create(student)

    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          authorId: student.id,
        },
        new UniqueEntityId('answer-id-01'),
      ),
    )

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-id-01'),
          authorId: student.id,
        }),
      )
    }

    const { value } = await sut.execute({
      page: 2,
      perPage: 10,
      answerId: 'answer-id-01',
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
