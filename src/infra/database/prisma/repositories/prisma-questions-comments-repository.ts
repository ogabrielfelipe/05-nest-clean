import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(questionCommentId: string) {
    const question = await this.prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionCommentMapper.toDomain(question)
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    if (!params.perPage) {
      params.perPage = 20 // Default value
    }

    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
    })

    return questionComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async create(questionComment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(questionComment: QuestionComment) {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    })
  }
}
