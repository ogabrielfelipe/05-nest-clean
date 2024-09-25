import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('E2E -> Create Question', () => {
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

  it('should be able to create a new question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hash('12345G*A32', 8),
      },
      select: { id: true, email: true },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Create first question',
        content: 'This is the first question created by API testing',
      })

    expect(response.statusCode).toBe(201)

    const question = await prisma.question.findUnique({
      where: { slug: 'create-first-question' },
    })

    expect(question).toBeTruthy()
    expect(question?.title).toBe('Create first question')
  })

  it('should not be able to create a new question without authentication', async () => {
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer `)
      .send({
        title: 'Create first question',
        content: 'This is the first question created by API testing',
      })

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    })
  })
})
