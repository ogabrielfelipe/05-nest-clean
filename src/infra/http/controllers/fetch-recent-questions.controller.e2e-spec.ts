import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('E2E -> Fetch Recent Questions', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to fetch recent questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hash('12345G*A32', 8),
      },
      select: { id: true, email: true },
    })

    for (let i = 0; i < 2; i++) {
      await prisma.question.create({
        data: {
          title: `Question ${i + 1}`,
          content: `Content for question ${i + 1}`,
          slug: `question-${i + 1}`,
          author: { connect: { id: user.id } },
        },
      })
    }

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions?page=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(2)
  })

  it('should be able to fetch recent questions paginated', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john-paginated-test@doe.com',
        password: await hash('12345G*A32', 8),
      },
      select: { id: true, email: true },
    })

    for (let i = 10; i < 15; i++) {
      await prisma.question.create({
        data: {
          title: `Question ${i + 1}`,
          content: `Content for question ${i + 1}`,
          slug: `question-${i + 1}`,
          author: { connect: { id: user.id } },
        },
      })
    }

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions?page=2&perPage=3')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(3)
  })
})
