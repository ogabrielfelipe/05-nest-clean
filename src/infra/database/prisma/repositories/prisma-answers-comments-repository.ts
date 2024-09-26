import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(answerCommentId: string) {
    const answer = await this.prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answer)
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    if (!params.perPage) {
      params.perPage = 20 // Default value
    }

    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
    })

    return answerComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async create(answerComment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(answerComment: AnswerComment) {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    })
  }
}
