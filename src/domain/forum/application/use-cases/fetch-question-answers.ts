import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionsAnswersRequest {
  page: number
  perPage: number
  questionId: string
}

type FetchQuestionsAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class FetchQuestionsAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    perPage,
    questionId,
  }: FetchQuestionsAnswersRequest): Promise<FetchQuestionsAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        perPage,
        page,
      },
    )

    return right({
      answers,
    })
  }
}
