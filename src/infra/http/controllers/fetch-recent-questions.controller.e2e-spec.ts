import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/infra/app.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionFactory } from 'test/factories/make-question'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { DatabaseModule } from '@/infra/database/database.module'

describe('E2E -> Fetch Recent Questions', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('should be able to fetch recent questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 1; i < 5; i++) {
      await questionFactory.makePrismaQuestion({
        title: `Question ${i + 1}`,
        slug: Slug.create(`question-${i + 1}`),
        authorId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get('/questions?page=1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(4)
  })

  it('should be able to fetch recent questions paginated', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 10; i < 15; i++) {
      await questionFactory.makePrismaQuestion({
        title: `Question ${i + 1}`,
        slug: Slug.create(`question-${i + 1}`),
        authorId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get('/questions?page=2&perPage=3')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.questions).toHaveLength(3)
  })
})
