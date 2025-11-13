import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenInputDto } from '../dto/filter.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Token Generation' })
  @ApiResponse({
    status: 200,
    description: 'Return a generated token for accesing the reports endpoints',
  })
  async login(@Body() user: TokenInputDto) {
    return this.authService.login(user);
  }
}
