import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export type BoilerPartsQueryType = {
  limit: string;

  offset: string;
};

export class BoilerParts {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  boiler_manufacturer: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  parts_manufacturer: string;

  @ApiProperty({ example: faker.lorem.words(2) })
  name: string;

  @ApiProperty({ example: faker.lorem.sentence(2) })
  description: string;

  @ApiProperty({ example: faker.string.alphanumeric(10) })
  vendor_code: string;

  @ApiProperty({ example: parseInt(faker.string.numeric(3)) })
  popularity: number;

  @ApiProperty({ example: faker.datatype.boolean() })
  bestseller;

  @ApiProperty({ example: faker.datatype.boolean() })
  new;

  @ApiProperty({ example: faker.lorem.words(7) })
  compatibility: string;

  @ApiProperty({ example: '2024-06-27T15:11:01.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2024-06-27T15:11:01.000Z' })
  updatedAt: string;
}

export class FindAndCountAllResponse {
  @ApiProperty({ example: 20 })
  count: number;
  @ApiProperty({ type: BoilerParts, isArray: true })
  rows: BoilerParts;
}

//BESTSELLERS

class GetBestsellers extends BoilerParts {
  @ApiProperty({ example: true })
  bestseller: boolean;
}

export class GetBestsellersResponse extends FindAndCountAllResponse {
  @ApiProperty({ type: GetBestsellers, isArray: true })
  rows: GetBestsellers;
}

//NEW

class GetNewParts extends BoilerParts {
  @ApiProperty({ example: true })
  new: boolean;
}

export class GetNewPartsResponse extends FindAndCountAllResponse {
  @ApiProperty({ type: GetNewParts, isArray: true })
  rows: GetNewParts;
}

//Find By id

export class GetBoilerPartsById extends BoilerParts {}

//NAME

export class GetBoilerPartsByNameRequest {
  @ApiProperty({ example: 'basium dicta' })
  name: string;
}

export class GetBoilerPartsByNameResponse extends BoilerParts {
  @ApiProperty({ example: 'basium dicta' })
  name: string;
}

// SEARCH BY WORD

export class GetSearchByWordRequest {
  @ApiProperty({ example: 'vos' })
  search: string;
}

class GetSearchByWord extends BoilerParts {
  @ApiProperty({ example: 'vos vulgus' })
  name: string;
}

export class GetSearchByNameResponse extends FindAndCountAllResponse {
  @ApiProperty({ type: GetSearchByWord, isArray: true })
  rows: GetSearchByWord;
}
