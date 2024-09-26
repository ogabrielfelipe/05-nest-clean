import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract create(AnswerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
