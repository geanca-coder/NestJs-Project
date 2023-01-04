import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma : PrismaService){}
    async editUser(user_id : number, dto : EditUserDto){
        const user = await this.prisma.user.update({
            where:{ 
                id : user_id,
            },
            data : {
                ...dto,
            },
        });
        delete user.hash;
        return user;
    }
}
