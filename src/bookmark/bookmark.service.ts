import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}
  async createBookmark(userId: number, dto: BookmarkDto) {
    const bookmark = await this.prismaService.bookmark.create({
      data: { userId, ...dto },
    });

    return bookmark;
  }

  async getBookmarks(userId: number) {
    const bookmarks = await this.prismaService.bookmark.findMany({
      where: { userId },
    });

    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    return bookmark;
  }

  async editBookmark(
    userId: number,
    bookmarkId: number,
    data: EditBookmarkDto,
  ) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    const updatedBookmark = await this.prismaService.bookmark.update({
      where: { id: bookmarkId },
      data: { ...data },
    });

    return updatedBookmark;
  }

  async deleteBookmark(bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.delete({
      where: { id: bookmarkId },
    });

    return bookmark;
  }
}
