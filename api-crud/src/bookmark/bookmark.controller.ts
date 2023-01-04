import { Controller ,Body, Param, UseGuards, Get, Post, Delete, Put, Patch, ParseIntPipe} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto } from './dto';
import { EditBookmarkDto } from './dto';
@UseGuards(JwtGuard)
@Controller('bookmarks')

export class BookmarkController {

    constructor(private bookmarkService : BookmarkService){}
    
    
    @Get()
    getBookmarks(@GetUser('id') user_id : number){
        return this.bookmarkService.getBookmarks(user_id);
    }

    @Post()
    createBookmark( @GetUser('id') userId: number, @Body() dto: CreateBookmarkDto){
        this.bookmarkService.createBookmark(userId, dto);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') user_id : number, @Param('id', ParseIntPipe) bookmark_id : number){
        return this.bookmarkService.getBookmarkById(user_id, bookmark_id);
    }
    
    @Patch(':id')
    editBookmarkById(@GetUser('id') user_id : number, @Body() dto : EditBookmarkDto, @Param('id', ParseIntPipe) bookmark_id : number){
        return this.bookmarkService.editBookmarkById(user_id, bookmark_id, dto);
    }
    
    @Delete(':id')
    deleteBookmarkById(@GetUser('id') user_id : number, @Param('id', ParseIntPipe) bookmark_id : number){
        return this.bookmarkService.deleteBookmarkById(user_id, bookmark_id)
    }
}
