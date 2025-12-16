import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Store files in the 'uploads' folder
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName); // Save file with a unique name
        },
      }),
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file); // Log the file object for debugging

    if (!file || !file.path) {
      throw new Error('File path is missing');
    }

    const members = [];

    return new Promise((resolve, reject) => {
      const stream = createReadStream(file.path); // Use the file's path to read the file

      stream
        .pipe(csvParser({ headers: ['username', 'payout'] }))
        .on('data', (row) => {
          console.log(row);
          if (!row.username || row.username.trim() === '') return; // Skip empty rows

          members.push({
            username: row.username,
            payout: parseInt((row.payout || '0').toString().replace(/[^\d]/g, '') || '0', 10),
            lastPayoutDue: new Date(),
            dateJoined: new Date(),
          });
        })
        .on('end', async () => {
          try {
            // Save members to DB
            await this.memberService.bulkCreate(members);

            // Clean up the uploaded file
            await unlink(file.path);

            // Send the members with formatted payouts
            const formattedMembers = members.map((member) => ({
              ...member,
              formattedPayout: new Intl.NumberFormat('en-US').format(
                member.payout,
              ),
            }));

            resolve({
              message: 'Members imported successfully',
              members: formattedMembers,
            });
          } catch (err) {
            await unlink(file.path);
            reject(err);
          }
        })
        .on('error', async (err) => {
          await unlink(file.path); // Cleanup file in case of error
          reject(err);
        });
    });
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.memberService.findOne(username);
  }

  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberService.update(username, updateMemberDto);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.memberService.delete(username);
  }
}
