import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { TokenSchema } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  perPage: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1).max(100)),
})

const queryValidationPipe = new ZodValidationPipe(queryParamsSchema)

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller()
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get('/questions')
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenSchema,
    @Query(queryValidationPipe) params: QueryParamsSchema,
  ) {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: params.perPage,
      skip: (params.page - 1) * params.perPage,
      select: {
        title: true,
        content: true,
        slug: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return {
      questions,
    }
  }
}
