import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.')
    }
    return QuestionComment.create(
      {
        questionId: new UniqueEntityId(raw.questionId),
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      content: questionComment.content,
      questionId: questionComment.questionId.toString(),
      authorId: questionComment.authorId.toString(),
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
