import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../auth/guards/firebase-auth.guard';
import { LabelService } from '../services/label.service';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';
import { Label } from '../schemas/label.schema';

@ApiTags('labels')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('labels')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new label' })
  @ApiResponse({
    status: 201,
    description: 'The label has been successfully created.',
    type: Label,
  })
  create(@Body() createLabelDto: CreateLabelDto, @Request() req) {
    return this.labelService.create(createLabelDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: 'Get all labels' })
  @ApiResponse({ status: 200, description: 'Return all labels.', type: [Label] })
  findAll(@Request() req) {
    return this.labelService.findAll(req.user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a label by id' })
  @ApiResponse({ status: 200, description: 'Return the label.', type: Label })
  findOne(@Param('id') id: string, @Request() req) {
    return this.labelService.findOne(id, req.user.uid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a label' })
  @ApiResponse({
    status: 200,
    description: 'The label has been successfully updated.',
    type: Label,
  })
  update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto, @Request() req) {
    return this.labelService.update(id, updateLabelDto, req.user.uid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a label' })
  @ApiResponse({ status: 200, description: 'The label has been successfully deleted.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.labelService.remove(id, req.user.uid);
  }
}
