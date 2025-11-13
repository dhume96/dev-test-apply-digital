import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenInputDto } from 'src/dto/filter.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: TokenInputDto) {
    const payload = { username: user.username, sub: Math.random().toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
