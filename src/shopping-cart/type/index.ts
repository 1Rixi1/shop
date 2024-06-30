import { ApiProperty } from '@nestjs/swagger';

// "id": 6,
//   "userId": 1,
//   "partId": 15,
//   "boiler_manufacturer": "Saunier Duval",
//   "parts_manufacturer": "Radian",
//   "name": "sophismata alter",
//   "image": "https://loremflickr.com/640/480/technics?lock=8768398357954560?random6",
//   "price": 1010,
//   "in_stock": 7,
//   "count": 1,
//   "total_price": 1010,
//   "createdAt": "2024-06-29T13:11:21.000Z",
//   "updatedAt": "2024-06-29T13:11:21.000Z"

export class ShoppingCartItem {
  @ApiProperty({ example: 6 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 15 })
  partId: number;

  @ApiProperty({ example: 'Saunier Duval' })
  boiler_manufacturer: string;

  @ApiProperty({ example: 'Radian' })
  parts_manufacturer: string;

  @ApiProperty({ example: 'sophismata alter' })
  name: string;

  @ApiProperty({
    example:
      'https://loremflickr.com/640/480/technics?lock=8768398357954560?random6',
  })
  image: string;

  @ApiProperty({ example: 1010 })
  price: number;

  @ApiProperty({ example: 7 })
  in_stock: number;

  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 1010 })
  total_price: number;

  @ApiProperty({ example: '2024-06-29T13:11:21.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-06-29T13:11:21.000Z' })
  updatedAt: string;
}

export class GetAllResponse extends ShoppingCartItem {}


export class AddItemResponse extends ShoppingCartItem {}

//COUNT

export class UpdateCountRequest {
  @ApiProperty({ example: 1 })
  count: number;
}
export class UpdateCountResponse {
  @ApiProperty({ example: 1 })
  count: number;
}

//TOTAL PRICE
export class UpdateTotalPriceRequest {
  @ApiProperty({ example: 1000 })
  total_price: number;
}
export class UpdateTotalCountResponse {
  @ApiProperty({ example: 1000 })
  total_price: number;
}
