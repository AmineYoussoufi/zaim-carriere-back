import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { CreateAuthDto } from 'src/dto/create-auth.dto';
import { Public } from '../is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async signIn(@Body() createAuthDTO: CreateAuthDto) {
    const { email, password } = createAuthDTO;
    return this.authService.signIn(email, password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
