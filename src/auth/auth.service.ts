import { Injectable } from '@nestjs/common';

// import { User, Bookmark } from '@prisma/client';

@Injectable({})
export class AuthService {
  login() {
    return { message: 'I am new signed in' };
  }
  signup() {
    return { message: 'I am new signed up' };
  }
}
