import {Test} from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

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
      describe('Bookmarks', ()=>{
      });

  });

  describe('Bookmarks', () => {


    describe('Create Bookmark', () =>{
    });

    describe('Get Bookmarks', () =>{
    });

    describe('Get Bookmark by id', () =>{      
    });

    describe('Edit Bookmark by id', () =>{
    });

    describe('Delete Bookmark by id', () =>{      
    });

  });
    
});

 
