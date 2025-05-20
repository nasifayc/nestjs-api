import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

// export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
//   constructor() {
//     super();
//   }
// }
