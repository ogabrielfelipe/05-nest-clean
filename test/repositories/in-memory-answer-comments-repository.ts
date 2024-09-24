import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findById(answerCommentId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === answerCommentId,
    )

    return question ?? null
  }

  async delete(answerComment: AnswerComment) {
    const index = this.items.findIndex((item) => item.id === answerComment.id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  async create(AnswerComment: AnswerComment) {
    this.items.push(AnswerComment)
  }
}
