import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller()
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post('/questions/:questionId/answers')
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, attachments } = body
    const userId = user.sub

    const result = await this.answerQuestionUseCase.execute({
      content,
      questionId,
      authorId: userId,
      attachmentIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
