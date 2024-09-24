import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/infra/app.module'
import { ConfigService } from '@nestjs/config'
import { EnvVars } from './infra/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService: ConfigService<EnvVars, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
