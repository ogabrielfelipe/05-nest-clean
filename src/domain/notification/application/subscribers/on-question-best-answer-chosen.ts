import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { SendNotificationUseCase } from '../use-case/send-notification'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/entities/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que você enviou em "${question.title.substring(0, 40).concat('[...]')}" foi escolhida pelo autor!`,
      })
    }
  }
}
