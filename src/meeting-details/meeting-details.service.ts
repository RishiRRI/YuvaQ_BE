import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeetingDetail } from './entities/meeting-detail.entity';
import { CreateMeetingDetailDto } from './dto/create-meeting-detail.dto';
import { UpdateMeetingDetailDto } from './dto/update-meeting-detail.dto';
import { Consultant } from 'src/consultant/entities/consultant.entity';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class MeetingDetailService {
  constructor(
    @InjectModel(MeetingDetail.name, 'Yuva')
    private readonly model: Model<MeetingDetail>,
    @InjectModel(Consultant.name, 'Yuva')
    private readonly consultantModel: Model<Consultant>,
    @InjectModel(Client.name, 'Yuva')
    private readonly clientModel: Model<Client>,
  ) {}

  private async isSlotFree(
    consultantId: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    const clash = await this.model.exists({
      consultantId,
      meetingStatus: { $ne: 'cancelled' },
      $or: [
        { startDateTime: { $gte: start, $lt: end } },
        { endDateTime: { $gt: start, $lte: end } },
        { startDateTime: { $lte: start }, endDateTime: { $gte: end } },
      ],
    });
    return !clash;
  }

  async create(dto: CreateMeetingDetailDto): Promise<MeetingDetail> {
    const start = new Date(dto.startDateTime as any);
    const end = new Date(dto.endDateTime as any);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('startDateTime / endDateTime invalid ISO');
    }

    const consultant = await this.consultantModel.findById(dto.consultantId);
    if (!consultant) throw new NotFoundException('Consultant not found');

    const day = start.getUTCDay();
    const win = consultant.weeklySchedule.find(
      (w) =>
        w.dayOfWeek === day &&
        start.toISOString().slice(11, 16) >= w.start &&
        end.toISOString().slice(11, 16) <= w.end,
    );
    if (!win) throw new BadRequestException('Slot is outside working hours');

    if (!(await this.isSlotFree(dto.consultantId, start, end))) {
      throw new BadRequestException('Slot already booked');
    }

    // if (consultant.bookingInADay) {
    //   const dayStart = new Date(dto.startDateTime);
    //   dayStart.setUTCHours(0, 0, 0, 0);
    //   const dayEnd = new Date(dayStart);
    //   dayEnd.setUTCHours(23, 59, 59, 999);
    //   const countToday = await this.model.countDocuments({
    //     consultantId: dto.consultantId,
    //     startDateTime: { $gte: dayStart, $lte: dayEnd },
    //     meetingStatus: { $ne: 'cancelled' },
    //   });
    //   if (countToday >= consultant.bookingInADay) {
    //     throw new BadRequestException('Daily booking limit reached');
    //   }
    // }

    const client = await this.clientModel.findById(dto.clientId);
    if (!client) throw new NotFoundException('Client not found');

    if (!client.firstFreeMeetingUsed) {
      client.firstFreeMeetingUsed = true;
      await client.save();
    }

    return new this.model({
      ...dto,
      startDateTime: start,
      endDateTime: end,
    }).save();
  }

  async extend(meetingId: string): Promise<MeetingDetail> {
    const meeting = await this.model.findById(meetingId);
    if (!meeting || meeting.meetingStatus !== 'scheduled')
      throw new NotFoundException('Active meeting not found');

    const nextEnd = new Date(meeting.endDateTime.getTime() + 30 * 60_000);

    const consultant = await this.consultantModel.findById(
      meeting.consultantId,
    );
    if (!consultant) {
      throw new NotFoundException('Consultant not found');
    }
    const day = meeting.startDateTime.getUTCDay();
    const slotOk = consultant.weeklySchedule.find(
      (w) =>
        w.dayOfWeek === day &&
        meeting.startDateTime.toISOString().slice(11, 16) >= w.start &&
        nextEnd.toISOString().slice(11, 16) <= w.end,
    );
    if (!slotOk)
      throw new BadRequestException('Consultant not available for extension');

    if (
      !(await this.isSlotFree(
        meeting.consultantId,
        meeting.endDateTime,
        nextEnd,
      ))
    )
      throw new BadRequestException('Next slot already booked');

    meeting.endDateTime = nextEnd;
    await meeting.save();
    return meeting;
  }

  async extendForNewClient(meetingId: string): Promise<MeetingDetail> {
    const meeting = await this.model.findById(meetingId);
    if (!meeting || meeting.meetingStatus !== 'scheduled')
      throw new NotFoundException('Active meeting not found');

    const nextEnd = new Date(meeting.endDateTime.getTime() + 20 * 60_000);

    const consultant = await this.consultantModel.findById(
      meeting.consultantId,
    );
    if (!consultant) {
      throw new NotFoundException('Consultant not found');
    }
    const day = meeting.startDateTime.getUTCDay();
    const slotOk = consultant.weeklySchedule.find(
      (w) =>
        w.dayOfWeek === day &&
        meeting.startDateTime.toISOString().slice(11, 16) >= w.start &&
        nextEnd.toISOString().slice(11, 16) <= w.end,
    );
    if (!slotOk)
      throw new BadRequestException('Consultant not available for extension');

    if (
      !(await this.isSlotFree(
        meeting.consultantId,
        meeting.endDateTime,
        nextEnd,
      ))
    )
      throw new BadRequestException('Next slot already booked');

    meeting.endDateTime = nextEnd;
    await meeting.save();
    return meeting;
  }

  async listFreeSlots(
    consultantId: string,
    dateIso: string,
  ): Promise<
    { slot: number; status: 'available' | 'booked'; start: Date; end: Date }[]
  > {
    const consultant = await this.consultantModel.findById(consultantId);
    if (!consultant) throw new NotFoundException('Consultant not found');

    const date = new Date(dateIso);
    date.setUTCHours(0, 0, 0, 0);
    const day = date.getUTCDay();

    const windows = consultant.weeklySchedule
      .filter((w) => w.dayOfWeek === day)
      .sort((a, b) => a.start.localeCompare(b.start));

    if (!windows.length) return [];

    const meetings = await this.model
      .find({
        consultantId,
        startDateTime: {
          $gte: date,
          $lt: new Date(date.getTime() + 86_400_000),
        },
        meetingStatus: { $ne: 'cancelled' },
      })
      .lean();

    const slots: {
      slot: number;
      status: 'available' | 'booked';
      start: Date;
      end: Date;
    }[] = [];

    let slotNo = 1;

    for (const w of windows) {
      const winStart = new Date(date);
      winStart.setUTCHours(
        +w.start.split(':')[0],
        +w.start.split(':')[1],
        0,
        0,
      );
      const winEnd = new Date(date);
      winEnd.setUTCHours(+w.end.split(':')[0], +w.end.split(':')[1], 0, 0);

      for (
        let t = new Date(winStart);
        t < winEnd;
        t = new Date(t.getTime() + 30 * 60_000)
      ) {
        const slotEnd = new Date(t.getTime() + 30 * 60_000);

        const clash = meetings.some(
          (m) => !(m.endDateTime <= t || m.startDateTime >= slotEnd),
        );

        slots.push({
          slot: slotNo++,
          status: clash ? 'booked' : 'available',
          start: t,
          end: slotEnd,
        });
      }
    }

    return slots;
  }

  // async create(dto: CreateMeetingDetailDto): Promise<MeetingDetail> {
  //   return new this.model(dto).save();
  // }

  // async create(dto: CreateMeetingDetailDto): Promise<MeetingDetail> {
  //   const consultant = await this.consultantModel
  //     .findById(dto.consultantId)
  //     .exec();

  //   if (!consultant) {
  //     throw new NotFoundException(`Consultant ${dto.consultantId} not found`);
  //   }

  //   const dailyLimit = consultant.bookingInADay ?? 0;

  //   if (dailyLimit > 0) {
  //     const start = new Date();
  //     start.setHours(0, 0, 0, 0);
  //     const end = new Date();
  //     end.setHours(23, 59, 59, 999);

  //     const todayCount = await this.model.countDocuments({
  //       consultantId: dto.consultantId,
  //       createdAt: { $gte: start, $lte: end },
  //     });

  //     if (todayCount >= dailyLimit) {
  //       throw new BadRequestException(
  //         `Daily booking limit (${dailyLimit}) reached for this consultant, Please try another day.`,
  //       );
  //     }
  //   }

  //   return new this.model(dto).save();
  // }

  async findAll(): Promise<MeetingDetail[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<MeetingDetail> {
    const item = await this.model.findById(id).exec();
    if (!item)
      throw new NotFoundException(`MeetingDetail with ID "${id}" not found`);
    return item;
  }

  async update(
    id: string,
    dto: UpdateMeetingDetailDto,
  ): Promise<MeetingDetail> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`MeetingDetail with ID "${id}" not found`);
    return updated;
  }

  async remove(id: string): Promise<MeetingDetail> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`MeetingDetail with ID "${id}" not found`);
    return deleted;
  }

  async findByFilters(filters: {
    consultantId?: string;
    clientId?: string;
    meetingStatus?: string;
  }): Promise<MeetingDetail[]> {
    const query: Record<string, any> = {};
    if (filters.consultantId) query.consultantId = filters.consultantId;
    if (filters.clientId) query.clientId = filters.clientId;
    if (filters.meetingStatus) query.meetingStatus = filters.meetingStatus;

    return this.model.find(query).sort({ startDateTime: -1 }).exec();
  }
}
