import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-object/slug'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from './events/question-best-answer-chosen-event'

export interface QuestionProps {
  title: string
  slug: Slug
  content: string
  authorId: UniqueEntityId
  bestAnswerID?: UniqueEntityId | null
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get bestAnswerID() {
    return this.props.bestAnswerID
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private except() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFormText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerID(bestAnswerID: UniqueEntityId | undefined | null) {
    if (bestAnswerID && bestAnswerID !== this.props.bestAnswerID) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerID))
    }

    this.props.bestAnswerID = bestAnswerID
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFormText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
