import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository, UserFilters, PaginatedUsersResult } from '@core/interfaces/user.repository.interface';
import { User } from '@core/entities/user.entity';
import { UserDocument } from '@infrastructure/database/schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const created = await this.userModel.create(user);
    return this.toEntity(created);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ id }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findWithFilters(
    filters: UserFilters,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedUsersResult> {
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { email: { $regex: filters.search, $options: 'i' } },
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.role) {
      query.roles = filters.role;
    }

    if (filters.isEmailVerified !== undefined) {
      query.isEmailVerified = filters.isEmailVerified;
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [docs, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(pagination.limit).sort({ createdAt: -1 }).exec(),
      this.userModel.countDocuments(query).exec(),
    ]);

    return {
      data: docs.map((doc) => this.toEntity(doc)),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const doc = await this.userModel.findOneAndUpdate({ id }, data, { new: true }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateRoles(id: string, roles: string[]): Promise<User | null> {
    const doc = await this.userModel.findOneAndUpdate(
      { id },
      { roles, updatedAt: new Date() },
      { new: true },
    ).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  private toEntity(doc: UserDocument): User {
    const docWithTimestamps = doc as UserDocument & { createdAt: Date; updatedAt: Date };
    return new User({
      id: doc.id,
      email: doc.email,
      password: doc.password,
      firstName: doc.firstName,
      lastName: doc.lastName,
      avatar: doc.avatar,
      isEmailVerified: doc.isEmailVerified,
      roles: doc.roles || ['participant'],
      createdAt: docWithTimestamps.createdAt,
      updatedAt: docWithTimestamps.updatedAt,
    });
  }
}
