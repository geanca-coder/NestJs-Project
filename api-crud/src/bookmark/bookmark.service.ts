import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prisma : PrismaService){}

    
    getBookmarks(user_id : number){
        return this.prisma.bookmark.findMany({
            where : {
                user_id
            }
        })
    }

    async createBookmark(user_id : number, dto : CreateBookmarkDto){
        const bookmark  = await this.prisma.bookmark.create({
            data:{
                user_id,
                ...dto
            },
        });

        return bookmark;
    }

    getBookmarkById(user_id : number, bookmark_id : number){
        return this.prisma.bookmark.findFirst({
            where : {
                id : bookmark_id ,
                user_id,
            },
        });
    }

    editBookmarkById(user_id : number, bookmark_id : number, dto : EditBookmarkDto){

    }

    deleteBookmarkById(user_id : number, bookmark_id : number){

    }
}
