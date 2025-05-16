import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: AuthDto) {
    console.log('Login Service class');

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordMatched = await argon.verify(user.hash, dto.password);
    if (!isPasswordMatched) {
      throw new ForbiddenException('Invalid credentials');
    }

    const { hash: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);
    try {
      // save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // return the saved user

      const { hash: _, ...userWithoutHash } = user;
      return userWithoutHash;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw e;
    }
  }
}
