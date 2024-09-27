import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class QuestionCommentsPresenter {
  static toHTTP(questionComment: QuestionComment) {
    return {
      content: questionComment.content,
      authorId: questionComment.authorId,
      questionId: questionComment.questionId,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
