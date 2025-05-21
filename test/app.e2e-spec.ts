import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { BookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'nasi11@gmail.com',
      password: '123456',
    };

    describe('Signup', () => {
      it('should throw exception if email is Invalid or empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: '', password: dto.password })
          .expectStatus(400);
      });

      it('should throw exception if password isempty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, password: '' })
          .expectStatus(400);
      });
      it('should throw exception if no data at all', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });

    describe('Signin', () => {
      // let accessToken: string;
      it('should throw exception if email is Invalid or empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: '', password: dto.password })
          .expectStatus(400);
      });

      it('should throw exception if password isempty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: '' })
          .expectStatus(400);
      });

      it('should throw exception if no data at all', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should update current user email', () => {
        return pactum
          .spec()
          .patch('/users/update')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            email: 'nasifayc11@gmail.com',
          })
          .expectStatus(200);
      });

      it('should update current user firstName', () => {
        return pactum
          .spec()
          .patch('/users/update')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            firstName: 'Nasifay',
          })
          .expectStatus(200);
      });
      it('should update current user lastName', () => {
        return pactum
          .spec()
          .patch('/users/update')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            lastName: 'Chala',
          })
          .expectStatus(200);
      });
    });
  });
  describe('Bookmark', () => {
    const bookmarkDto: BookmarkDto = {
      title: 'Test Bookmark',
      link: 'https://www.youtube.com',
      description: 'Test Description',
    };
    const editBookmarkDto: EditBookmarkDto = {
      title: 'Edited Test Bookmark',
      link: 'https://www.github.com',
      description: 'Edited Test Description',
    };
    describe('Create bookmark', () => {
      it('should throw exception if title is missing', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            link: bookmarkDto.link,
            description: bookmarkDto.description,
          })
          .expectStatus(400);
      });
      it('should throw exception if link is missing', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            title: bookmarkDto.title,
            description: bookmarkDto.description,
          })
          .expectStatus(400);
      });
      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(bookmarkDto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark/all')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit bookmark', () => {
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmark/$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(editBookmarkDto)
          .expectStatus(200);
      });
    });
    describe('Delete bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });
});
