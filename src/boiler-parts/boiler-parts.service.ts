import { Injectable } from '@nestjs/common';
import { BoilerParts } from './boiler-parts.model';
import { BoilerPartsQueryType } from './types';

import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BoilerPartsService {
  constructor(
    @InjectModel(BoilerParts) private boilerParts: typeof BoilerParts,
  ) {}

  async findByPaginateAndFiler(
    query: BoilerPartsQueryType,
  ): Promise<{ count: number; rows: BoilerParts[] }> {
    const limit = +query.limit;
    const offset = +query.offset * 20;

    return this.boilerParts.findAndCountAll({ limit, offset });
  }

  async findByBestseller(): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerParts.findAndCountAll({ where: { bestseller: true } });
  }

  async findByNew(): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerParts.findAndCountAll({ where: { new: true } });
  }

  async findByOne(id: number): Promise<BoilerParts> {
    return this.boilerParts.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.boilerParts.findOne({ where: { name } });
  }

  async findBySearchWord(
    str: string,
  ): Promise<{ count: number; rows: BoilerParts[] }> {
    return this.boilerParts.findAndCountAll({
      limit: 20,
      where: { name: { [Op.like]: `%${str}%` } },
    });
  }
}
