import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class BoilerParts extends Model {
  @Column
  boiler_manufacturer: string;

  @Column
  parts_manufacturer: string;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  vendor_code: string;

  @Column
  images: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column
  popularity: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: false })
  new: boolean;

  @Column
  compatibility: string;
}
