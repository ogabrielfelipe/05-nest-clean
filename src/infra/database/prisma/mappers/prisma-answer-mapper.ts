import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        questionId: new UniqueEntityId(raw.questionId),
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
