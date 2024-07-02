import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { UsersService } from '../users/users.service';
import { BoilerPartsService } from '../boiler-parts/boiler-parts.service';
import { AddToShoppingCartDto } from './dto/add-to-shopping-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart) private shoppingCart: typeof ShoppingCart,
    private readonly userService: UsersService,
    private readonly boilerPartsService: BoilerPartsService,
  ) {}

  async findAll(userId: number | string) {
    return await this.shoppingCart.findAll({ where: { userId } });
  }

  async addPart(addToShoppingCardDto: AddToShoppingCartDto) {
    const cart = new ShoppingCart();

    const user = await this.userService.findOne({
      username: addToShoppingCardDto.username,
    });

    const part = await this.boilerPartsService.findByOne(
      addToShoppingCardDto.partId,
    );

    cart.userId = user.id;
    cart.partId = part.id;

    cart.boiler_manufacturer = part.boiler_manufacturer;
    cart.parts_manufacturer = part.parts_manufacturer;

    cart.name = part.name;
    cart.image = JSON.parse(part.images)[0];
    cart.price = part.price;
    cart.in_stock = part.in_stock;
    cart.total_price = part.price;

    return cart.save();
  }

  async updateCount(count: number, partId: string | number) {
    await this.shoppingCart.update({ count }, { where: { partId } });

    const part = await this.shoppingCart.findOne({ where: { partId } });

    return { count: part.count };
  }

  async updateTotalPrice(total_price: number, partId: string | number) {
    await this.shoppingCart.update({ total_price }, { where: { partId } });

    const part = await this.shoppingCart.findOne({ where: { partId } });

    return { total_price: part.total_price };
  }

  async deleteOne(partId: string | number) {
    const part = await this.shoppingCart.findOne({ where: { partId } });

    await part.destroy();
  }

  async deleteAll(userId: string | number) {
    await this.shoppingCart.destroy({ where: { userId } });
  }
}
