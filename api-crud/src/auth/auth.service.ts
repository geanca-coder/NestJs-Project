import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    
    async signup(dto : AuthDto){
        //generate password hash
        const hash = await argon.hash(dto.password);
        try{
            const user = await this.prisma.user.create({
                data: {
                    email : dto.email,
                    hash,
                },
                // select :{
                //     id: true,
                //     email : true,
                //     createdAt : true,
                //     updatedAt : true,
                //     firstName : true,
                //     lastName : true
                // }
            });
            //save the new user in the db
            delete user.hash;
            //return the saved user
            return user;
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('User email already registered');
                }
            }
        }
 
    }


    signin(){
        return {
            msg : 'You are logged in'
        }
    }

}

