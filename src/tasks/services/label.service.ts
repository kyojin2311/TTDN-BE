import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Label, LabelDocument } from '../schemas/label.schema';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';

@Injectable()
export class LabelService {
  constructor(@InjectModel(Label.name) private labelModel: Model<LabelDocument>) {}

  async create(createLabelDto: CreateLabelDto, userId: string): Promise<Label> {
    const createdLabel = new this.labelModel({
      ...createLabelDto,
      userId,
    });
    return createdLabel.save();
  }

  async findAll(userId: string): Promise<Label[]> {
    return this.labelModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Label> {
    const label = await this.labelModel.findOne({ _id: id, userId }).exec();
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    return label;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto, userId: string): Promise<Label> {
    const updatedLabel = await this.labelModel
      .findOneAndUpdate({ _id: id, userId }, updateLabelDto, { new: true })
      .exec();
    if (!updatedLabel) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    return updatedLabel;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.labelModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
  }
}
