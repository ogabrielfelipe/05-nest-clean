import { DomainEvents } from '@/core/events/domain-events'
import type { QuestionAttachmentsRepository } from './../../src/domain/forum/application/repositories/question-attachments-repository'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async save(question: Question): Promise<Question> {
    const index = this.items.findIndex((item) => item.id === question.id)

    this.items[index] = question
    DomainEvents.dispatchEventsForAggregate(question.id)
    return this.items[index]
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    )

    return question ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    return question ?? null
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
