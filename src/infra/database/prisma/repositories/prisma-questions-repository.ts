import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findById(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent(params: PaginationParams) {
    if (!params.perPage) {
      params.perPage = 20 // Default value
    }

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }
}
