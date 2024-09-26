import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Comment as PrismaComment, Prisma } from '@prisma/client'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }
    return AnswerComment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      content: answerComment.content,
      answerId: answerComment.answerId.toString(),
      authorId: answerComment.authorId.toString(),
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
