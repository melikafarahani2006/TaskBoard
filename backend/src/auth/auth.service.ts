import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser: UserDocument | null =
      await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user: UserDocument = await this.usersService.create(registerDto);

    const payload = { sub: user._id.toString(), email: user.email };

    return {
      message: 'User registered successfully',
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user: UserDocument | null =
      await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = { sub: user._id.toString(), email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
