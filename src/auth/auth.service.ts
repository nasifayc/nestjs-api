import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

// import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return { message: 'I am new signed in' };
  }
  async signup(dto: AuthDto) {
    // generate the password
    const hash = await argon.hash(dto.password);

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
  }
}
