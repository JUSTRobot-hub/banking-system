import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity({
  name: 'users',
})
export class User {
  @ApiProperty({
    description: 'ID of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'first name of user',
    example: 'Mostafa',
  })
  @Column()
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'first name of user',
    example: 'ElBadry',
  })
  @Column()
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'username of user', example: 'username' })
  @Column()
  @Index()
  @Expose()
  username: string;

  @ApiProperty({ description: 'email of user', example: 'test@email.com' })
  @Column()
  @Index()
  @Expose()
  email: string;

  @ApiProperty({ description: 'phone of user', example: '0100000000' })
  @Column()
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'address of user',
    example: 'Cairo, Egypt',
  })
  @Column()
  @Expose()
  address: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'integer', default: 3 })
  @Exclude()
  maxAllowedAccounts: number;

  @Column('jsonb', { nullable: true })
  @Expose()
  hash: { expiryDate: Date; value: string } | null;

  @Column({ nullable: true })
  otp2FASecret: string;

  @Index()
  @Column('boolean', { default: false })
  is2FAEnabled: boolean;

  @Index()
  @Column('boolean', { default: false })
  blocked: boolean;

  @ApiProperty({ description: 'Created date of user' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  token: string;

  @BeforeInsert()
  async beforeInsert() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.updatedAt = new Date();
  }

  async passwordCheck(password: string): Promise<boolean> {
    const isPassword = await bcrypt.compare(password, this.password);
    return isPassword;
  }
}
