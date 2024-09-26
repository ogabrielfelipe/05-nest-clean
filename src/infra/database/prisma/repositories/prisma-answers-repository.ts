import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(answerId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    if (!params.perPage) {
      params.perPage = 20 // Default value
    }

    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(answer: Answer) {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
