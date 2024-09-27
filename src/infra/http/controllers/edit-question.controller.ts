import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller()
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}

  @Put('/questions/:id')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @Param('id') questionId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.editQuestionUseCase.execute({
      questionId,
      authorId: userId,
      title,
      content,
      attachmentIds: [], // TODO: Add attachmentIds from request body.
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
