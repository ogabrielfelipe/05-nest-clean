import type { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  private status: number

  constructor(message?: string) {
    super(message ?? 'Not allowed.')
    this.status = 403
  }

  get statusCode() {
    return this.status
  }
}
