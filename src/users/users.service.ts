import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as argon from "argon2";
import { v4 as uuidv4 } from "uuid";

import { PrismaService } from "@src/core/prisma/prisma.service";

import { CreateUserDto } from "./dto";
import { UpdateUserDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: undefined,
      },
    });

    return await this.FormatReturUser(users);
  }

  async findAllByUsername(username: string) {
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
        deletedAt: undefined,
      },
    });

    return await this.FormatReturUser(users);
  }

  async findAllByEmail(email: string) {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
          mode: "insensitive",
        },
        deletedAt: undefined,
      },
    });

    return await this.FormatReturUser(users);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException("user by id not fount");

    return await this.FormatReturUser(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new NotFoundException("user by email not fount");

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    await this.findEmailUnique(dto.email);
    await this.findUsernameUnique(dto.username);

    if (dto.password) {
      const hash = await argon.hash(dto.password);
      dto.password = hash;
    }

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        hash: dto.password,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    if (dto.email) await this.findEmailUnique(dto.email);
    if (dto.username) await this.findUsernameUnique(dto.username);

    if (dto.password) {
      const hash = await argon.hash(dto.password);
      dto.password = hash;
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        username: dto.username,
        hash: dto.password,
      },
    });
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    const newOnique = this.newKeysUniquesForUserDelete(
      user[0].email,
      user[0].username,
    );

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: newOnique.newUniqueEmail,
        username: newOnique.newUniqueUsername,
      },
    });
  }

  private async findUsernameUnique(username: string) {
    const userWitUsername = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userWitUsername)
      throw new NotFoundException("user by username already exist");
  }

  private newKeysUniquesForUserDelete(email: string, username: string) {
    const newUniqueEmail = `${email}-${uuidv4()}`;
    const newUniqueUsername = `${username}-${uuidv4()}`;

    return {
      newUniqueEmail,
      newUniqueUsername,
    };
  }

  private async findEmailUnique(email: string) {
    const userWitUsername = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWitUsername)
      throw new NotFoundException("user by email already exist");
  }

  private async FormatReturUser(user: User | User[]) {
    return Array.isArray(user)
      ? Promise.all(
          user.map(user => {
            return {
              id: user.id,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              username: user.username,
              email: user.email,
            };
          }),
        )
      : [
          {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            username: user.username,
            email: user.email,
          },
        ];
  }
}
