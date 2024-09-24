import { InMemoryAnswerAttachmentsRepository } from './../../../../../test/repositories/in-memory-answer-attachments.repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create an Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const { value } = await sut.execute({
      content: 'Nova resposta',
      instructorId: '1',
      questionId: '2',
      attachmentIds: ['attachment-01', 'attachment-02'],
    })

    expect(value?.answer.id).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0].id).toEqual(value?.answer.id)

    expect(
      inMemoryAnswersRepository.items[0].attachment.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachment.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-01'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('attachment-02'),
      }),
    ])
  })
})
