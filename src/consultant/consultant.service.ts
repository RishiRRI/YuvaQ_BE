import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultant } from './entities/consultant.entity';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';

@Injectable()
export class ConsultantService {
  constructor(
    @InjectModel(Consultant.name, 'Yuva')
    private readonly model: Model<Consultant>,
  ) {}

  async create(dto: CreateConsultantDto): Promise<Consultant> {
    const doc = new this.model(dto);
    return doc.save();
  }

  async findAll(): Promise<Consultant[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findAllVerifiedConsultant(): Promise<Consultant[]> {
    return this.model.find({ isVerified: true }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Consultant> {
    const item = await this.model.findById(id).exec();
    if (!item)
      throw new NotFoundException(`Consultant with ID "${id}" not found`);
    return item;
  }

  async findOneByCode(referralCode: string) {
    return this.model.findOne({
      referralCode: referralCode,
    });
  }

  async update(id: string, dto: UpdateConsultantDto): Promise<Consultant> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Consultant with ID "${id}" not found`);
    return updated;
  }

  async remove(id: string): Promise<Consultant> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Consultant with ID "${id}" not found`);
    return deleted;
  }

  async completion(id: string): Promise<number> {
    const c = await this.findOne(id);

    const big3 = [
      c.listOfQualification,
      c.listOfPreviousExperience,
      c.listOfExpertise,
    ];
    const weightBig3 = 60;

    const basics = [c.fullName, c.email, c.phoneNumber];
    const weightBasics = 20;

    const extras = [
      c.emergencyPhoneNumber,
      c.consultantImage,
      c.gender,
      // c.DOJ,
      c.DOB,
      c.presentAddress,
      c.presentCity,
      c.presentState,
      c.presentPincode,
      c.division,
      c.department,
      c.languages,
      c.consultationRate,
      c.shift,
      // c.workPermit,
      // c.bookingInADay,
      c.availableTime,
    ];
    const weightExtras = 20;

    const filled = (val: any) =>
      val !== null &&
      val !== undefined &&
      val !== '' &&
      !(Array.isArray(val) && val.length === 0);

    const scoreBig3 = (big3.filter(filled).length / big3.length) * weightBig3;

    const scoreBasics =
      (basics.filter(filled).length / basics.length) * weightBasics;

    const scoreExtras =
      (extras.filter(filled).length / extras.length) * weightExtras;

    const total = +(scoreBig3 + scoreBasics + scoreExtras).toFixed(0);

    return total;
  }

  async findByExpertise(tags: string[]): Promise<Consultant[]> {
    if (!tags.length) return [];

    const regexes = tags.map((t) => new RegExp(`^${t}$`, 'i'));

    return this.model
      .find({ listOfExpertise: { $in: regexes } })
      .sort({ createdAt: -1 })
      .exec();
  }
}
