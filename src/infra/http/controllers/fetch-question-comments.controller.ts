import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { AnswerPresenter } from '../presenters/answer-presenter'
import { QuestionCommentsPresenter } from '../presenters/question-comments-presenter'

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
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get('/questions/:questionId/comments')
  @HttpCode(200)
  async handle(
    @CurrentUser() user: TokenSchema,
    @Param('questionId') questionId: string,
    @Query(queryValidationPipe) params: QueryParamsSchema,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page: params.page,
      perPage: params.perPage,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questionComments = result.value.questionComments

    return { comments: questionComments.map(QuestionCommentsPresenter.toHTTP) }
  }
}
