import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";

import {z} from 'zod'

const createAccountSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8).max(100),
})

type CreateAccountBodySchema = z.infer<typeof createAccountSchema>

@Controller('/accounts')
export class CreateAccountController{
    constructor(private prisma: PrismaService){}
    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountSchema))
    async handle(@Body() body: CreateAccountBodySchema){
        const {name, email, password} = body

        const userWithEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(userWithEmail){
            throw new ConflictException('Email already in use')
        }

        const passHash = await hash(password, 8)
        
        await this.prisma.user.create({
            data: {
                name,
                email,
                password: passHash,
            }
        })
    }
}