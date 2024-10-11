import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/infra/app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { EnvService } from '@/infra/env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('API de Forum')
    .setDescription(
      'Essa sistema tem como objetivo fornecer uma API para a gestão de um Forum',
    )
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
