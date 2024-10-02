import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}
  createMany(attachments: QuestionAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findManyByQuestionId(questionId: string) {
    const attachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }
}
