import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'

describe('E2E -> Authenticate', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  it('should be able to authenticate', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john@doe.com',
      password: await hash('12345G*A32', 8),
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
