import type { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  private status: number

  constructor() {
    super('Not allowed.')
    this.status = 403
  }

  get statusCode() {
    return this.status
  }
}
