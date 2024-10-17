import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller()
export class DeleteCommentOnAnswerController {
  constructor(
    private deleteCommentOnAnswerUseCase: DeleteAnswerCommentUseCase,
  ) {}

  @Delete('/answers/comments/:id')
  @HttpCode(204)
  async handle(
    @Param('id') answerCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const result = await this.deleteCommentOnAnswerUseCase.execute({
      answerCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
