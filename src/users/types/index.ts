import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan123@gmail.com' })
  email: string;

  @ApiProperty({ example: 'ivan123' })
  password: string;

  @ApiProperty({ example: '2024-06-27T10:41:38.444Z' })
  updatedAt: string;

  @ApiProperty({ example: '2024-06-27T10:41:38.444Z' })
  createdAt: string;
}

export class LoginUserRequest {
  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan123' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      userId: 1,
      username: 'ivan',
      email: 'ivan123@gmail.com',
    },
  })
  user: {
    userId: number;
    username: string;
    email: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan123@gmail.com' })
  email: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'session had ended' })
  msg: string;
}
