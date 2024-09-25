import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('E2E -> Authenticate', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it('should be able to authenticate', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hash('12345G*A32', 8),
      },
      select: { id: true, email: true },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@doe.com',
      password: '12345G*A32',
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
