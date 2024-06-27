import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoilerPartsService } from './boiler-parts.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  FindAndCountAllResponse,
  GetBestsellersResponse,
  GetBoilerPartsById,
  GetBoilerPartsByNameRequest,
  GetBoilerPartsByNameResponse,
  GetNewPartsResponse,
  GetSearchByNameResponse,
  GetSearchByWordRequest,
} from './types';

@Controller('boiler-parts')
export class BoilerPartsController {
  constructor(private readonly boilerPartsService: BoilerPartsService) {}

  @ApiOkResponse({ type: FindAndCountAllResponse })
  @UseGuards(AuthenticatedGuard)
  @Get()
  paginateAndFiler(@Query() query) {
    return this.boilerPartsService.findByPaginateAndFiler(query);
  }

  @ApiOkResponse({ type: GetBestsellersResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('bestsellers')
  getByBestsellers() {
    return this.boilerPartsService.findByBestseller();
  }

  @ApiOkResponse({ type: GetNewPartsResponse })
  @UseGuards(AuthenticatedGuard)
  @Get('new')
  getByNew() {
    return this.boilerPartsService.findByNew();
  }

  @ApiOkResponse({ type: GetBoilerPartsById })
  @UseGuards(AuthenticatedGuard)
  @Get('find/:id')
  getByOne(@Param('id') id: string) {
    return this.boilerPartsService.findByOne(+id);
  }

  @ApiBody({ type: GetBoilerPartsByNameRequest })
  @ApiOkResponse({ type: GetBoilerPartsByNameResponse })
  @UseGuards(AuthenticatedGuard)
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.boilerPartsService.findByName(name);
  }

  @ApiBody({ type: GetSearchByWordRequest })
  @ApiOkResponse({ type: GetSearchByNameResponse })
  @UseGuards(AuthenticatedGuard)
  @Post('search')
  getBySearchWord(@Body() { search }: { search: string }) {
    return this.boilerPartsService.findBySearchWord(search);
  }
}
