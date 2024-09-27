import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller()
export class DeleteCommentOnQuestionController {
  constructor(
    private deleteCommentOnQuestionUseCase: DeleteQuestionCommentUseCase,
  ) {}

  @Delete('/questions/comments/:id')
  @HttpCode(204)
  async handle(
    @Param('id') questionCommentId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const userId = user.sub

    const result = await this.deleteCommentOnQuestionUseCase.execute({
      questionCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
