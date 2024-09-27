import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class AnswerCommentsPresenter {
  static toHTTP(answerComment: AnswerComment) {
    return {
      content: answerComment.content,
      authorId: answerComment.authorId,
      answerId: answerComment.answerId,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
