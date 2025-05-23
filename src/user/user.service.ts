import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getMe(id: number) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { hash, ...userData } = user;
    console.log(hash);

    return userData;
  }

  async editUser(id: number, data: EditUserDto) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...data },
    });

    const { hash, ...userData } = updatedUser;
    console.log(hash);

    return userData;
  }
}
