import {Test} from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () =>{
  let app : INestApplication;
  let prisma : PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist : true
    }));
    await app.init();

    await app.listen(3000);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3000')
  });
  afterAll(() => {
    app.close();
  });
  
  
  describe('Auth', () =>{
    const dto : AuthDto = {
      email : 'diana@gmail.com',
      password : 'Geancarlosberm54@'
    }
    describe('Signup', ()=>{

      it('should throw an exception if email is empty', () => {
  
          return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email : '',
            password : 'lol'
          })

          .expectStatus(400);
      });

      it('should throw an exception if password is empty', () => {
  
          return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email : 'outloshdkls@gmail.com',
            password : ''
          })
          .expectStatus(400);
      });

      it('should throw an exception if body not provided', () => {
  
        return pactum
        .spec()
        .post('/auth/signup')
        .expectStatus(400);
      });

      it('should sign up', () => {
   
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)

      });
    });

    describe('Signin', ()=>{

      it('should throw an exception if email is empty', () => {
  
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email : '',
          password : 'lol'
        })

        .expectStatus(400);
    });

    it('should throw an exception if password is empty', () => {

        return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email : 'outloshdkls@gmail.com',
          password : ''
        })
        .expectStatus(400);
    });

    it('should throw an exception if body not provided', () => {

      return pactum
      .spec()
      .post('/auth/signin')
      .expectStatus(400);
    });

    it('should sign in', () => {
 
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token')
    });
      
      });
  });

   describe('User', () => {

      describe('Get me', ()=>{

        it('should get current user', ()=>{

          return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}',
          })
          .expectStatus(200);

        });
      
    
      });


      describe('Edit User', ()=>{

        it('should edit user', () =>{
          const dto : EditUserDto = {
             firstName: 'Diana',
             email : 'diana@gmail.com'
          }
          return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization : 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email);
        });
      });

  });

  describe('Bookmarks', () => {

    describe('Get empty list of bookmarks', () => {
      it('should get no bookmarks', () =>{
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });


    describe('Create Bookmark', () =>{
      const dto : CreateBookmarkDto = {
        title : "First Bookmark",
        link : 'https://github.com/geanca-coder'
      }
      it('it should create a bookmark', () =>{
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('bookmarkId', 'id')
          .expectStatus(201);

      });

    });

    describe('Get Bookmarks by id', () =>{
      it('should get ONE bookmark by id', () =>{
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id','$S{bookmarkId}')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
        
      });
    });

    describe('Get Bookmarks', () =>{   

       it('should get all bookmarks', () =>{
        return pactum
          .spec()
          .get('/bookmarks/')
          .withHeaders({
            Authorization : 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });

    });

    describe('Edit Bookmark by id', () =>{
    });

    describe('Delete Bookmark by id', () =>{      
    });

  });
    
});
