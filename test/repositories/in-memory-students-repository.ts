import { DomainEvents } from '@/core/events/domain-events'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  constructor() {}

  async create(student: Student): Promise<void> {
    this.items.push(student)
    DomainEvents.dispatchEventsForAggregate(student.id)
  }

  async findById(studentId: string) {
    const student = this.items.find((item) => item.id.toString() === studentId)

    return student ?? null
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    return student ?? null
  }
}
