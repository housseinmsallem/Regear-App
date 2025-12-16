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
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import {
  formatDateToMMDDYYYY,
  parseDateFromDDMMYYYY,
} from 'src/helper/formatDate';
import { Console } from 'console';
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.pricesService.create(createPriceDto);
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

    const prices = [];

    return new Promise((resolve, reject) => {
      const stream = createReadStream(file.path); // Use the file's path to read the file

      stream
        .pipe(
          csvParser({
            headers: [
              'Timing',
              'ItemName',
              'T7',
              'T8',
              'BW_4_3',
              'BW_5_2',
              'BW_5_3',
              'BW_6_1',
              'BW_6_2',
              'BW_last_Checked',
              'FS_4_3',
              'FS_5_2',
              'FS_5_3',
              'FS_6_1',
              'FS_6_2',
              'FS_last_Checked',
              'alternativeTier',
            ],
          }),
        )
        .on('data', (row) => {
          prices.push({
            timing: row['Timing'] ? row['Timing'] : 'Never',
            itemName: row['ItemName'] ? row['ItemName'] : 'None',
            T7: parseInt(row['T7']?.replace(/[^\d]/g, '') || '0', 10),
            T8: parseInt(row['T8']?.replace(/[^\d]/g, '') || '0', 10),
            BW_4_3: parseInt(row['BW_4_3']?.replace(/[^\d]/g, '') || '0', 10),
            BW_5_2: parseInt(row['BW_5_2']?.replace(/[^\d]/g, '') || '0', 10),
            BW_5_3: parseInt(row['BW_5_3']?.replace(/[^\d]/g, '') || '0', 10),
            BW_6_1: parseInt(row['BW_6_1']?.replace(/[^\d]/g, '') || '0', 10),
            BW_6_2: parseInt(row['BW_6_2']?.replace(/[^\d]/g, '') || '0', 10),
            BW_lastChecked: row['BW_last_Checked']
              ? parseDateFromDDMMYYYY(row['BW_last_Checked'])
              : 'Never',
            FS_4_3: parseInt(row['FS_4_3']?.replace(/[^\d]/g, '') || '0', 10),
            FS_5_2: parseInt(row['FS_5_2']?.replace(/[^\d]/g, '') || '0', 10),
            FS_5_3: parseInt(row['FS_5_3']?.replace(/[^\d]/g, '') || '0', 10),
            FS_6_1: parseInt(row['FS_6_1']?.replace(/[^\d]/g, '') || '0', 10),
            FS_6_2: parseInt(row['FS_6_2']?.replace(/[^\d]/g, '') || '0', 10),
            FS_last_Checked: row['FS_last_Checked']
              ? parseDateFromDDMMYYYY(row['FS_last_Checked'])
              : 'Never',
            alternativeTier: row['alternativeTier']
              ? row['alternativeTier']
              : 'None',
          });
        })
        .on('end', async () => {
          try {
            // Save members to DB
            await this.pricesService.bulkCreate(prices);

            // Clean up the uploaded file
            await unlink(file.path);

            // Send the members with formatted payouts
            const formattedPrices = prices.map((price) => ({
              ...price,
              T7: new Intl.NumberFormat('en-US').format(price.T7),
              T8: new Intl.NumberFormat('en-US').format(price.T8),
              BW_4_3: new Intl.NumberFormat('en-US').format(price.BW_4_3),
              BW_5_2: new Intl.NumberFormat('en-US').format(price.BW_5_2),
              BW_5_3: new Intl.NumberFormat('en-US').format(price.BW_5_3),
              BW_6_1: new Intl.NumberFormat('en-US').format(price.BW_6_1),
              BW_6_2: new Intl.NumberFormat('en-US').format(price.BW_6_2),
              FS_4_3: new Intl.NumberFormat('en-US').format(price.FS_4_3),
              FS_5_2: new Intl.NumberFormat('en-US').format(price.FS_5_2),
              FS_5_3: new Intl.NumberFormat('en-US').format(price.FS_5_3),
              FS_6_1: new Intl.NumberFormat('en-US').format(price.FS_6_1),
              FS_6_2: new Intl.NumberFormat('en-US').format(price.FS_6_2),
            }));

            resolve({
              message: 'Prices imported successfully',
              prices: formattedPrices,
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
    return this.pricesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.pricesService.update(+id, updatePriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricesService.remove(+id);
  }
}
