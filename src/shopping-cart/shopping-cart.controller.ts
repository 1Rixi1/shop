import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { AddToShoppingCartDto } from './dto/add-to-shopping-cart.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  AddItemResponse,
  GetAllResponse,
  UpdateCountRequest,
  UpdateCountResponse,
  UpdateTotalCountResponse,
  UpdateTotalPriceRequest,
} from './type';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @UseGuards(AuthenticatedGuard)
  @Get(':userId')
  getAll(@Param('userId') userId: string) {
    return this.shoppingCartService.findAll(userId);
  }

  @ApiOkResponse({ type: AddItemResponse })
  @UseGuards(AuthenticatedGuard)
  @Post('add')
  addToCart(@Body() addToShoppingCartDto: AddToShoppingCartDto) {
    return this.shoppingCartService.addPart(addToShoppingCartDto);
  }

  @ApiBody({ type: UpdateCountRequest })
  @ApiOkResponse({ type: UpdateCountResponse })
  @UseGuards(AuthenticatedGuard)
  @Patch('update-count/:partId')
  updateCount(
    @Param('partId') partId: string,
    @Body() { count }: { count: number },
  ) {
    return this.shoppingCartService.updateCount(count, partId);
  }

  @ApiBody({ type: UpdateTotalPriceRequest })
  @ApiOkResponse({ type: UpdateTotalCountResponse })
  @UseGuards(AuthenticatedGuard)
  @Patch('update-total/:partId')
  updateTotalPrice(
    @Param('partId') partId: string,
    @Body() { total_price }: { total_price: number },
  ) {
    return this.shoppingCartService.updateTotalPrice(total_price, partId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('one/:partId')
  deleteOne(@Param('partId') partId: string) {
    return this.shoppingCartService.deleteOne(partId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('all/:userId')
  deleteAll(@Param('userId') userId: string) {
    return this.shoppingCartService.deleteAll(userId);
  }
}
