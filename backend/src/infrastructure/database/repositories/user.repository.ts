import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
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

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const doc = await this.userModel.findOneAndUpdate({ id }, data, { new: true }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  private toEntity(doc: UserDocument): User {
    return new User({
      id: doc.id,
      email: doc.email,
      password: doc.password,
      firstName: doc.firstName,
      lastName: doc.lastName,
      avatar: doc.avatar,
      isEmailVerified: doc.isEmailVerified,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date,
    });
  }
}
