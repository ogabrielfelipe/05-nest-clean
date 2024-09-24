import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post('/questions')
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.createSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        author: { connect: { id: userId } },
      },
    })
  }

  private createSlug(input: string): string {
    const normalized = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const sanitized = normalized.replace(/[^a-zA-Z0-9\s]/g, '')

    const spaced = sanitized.replace(/\s+/g, '-')

    const slug = spaced.toLowerCase()

    return slug.replace(/-+/g, '-').replace(/^-|-$/g, '')
  }
}
