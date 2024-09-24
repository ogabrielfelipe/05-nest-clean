import type { UseCaseError } from '@/core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  private status: number
  private messageError: string

  constructor(messageError: string | null) {
    super(messageError as string)
    this.messageError = messageError ?? 'Resource not found'
    this.status = 404
  }

  get statusCode() {
    return this.status
  }

  get message() {
    return this.messageError
  }
}
