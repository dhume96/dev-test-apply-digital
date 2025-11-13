import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenInputDto } from 'src/dto/filter.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: { login: jest.Mock };

  beforeEach(async () => {
    mockService = { login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should call authService.login with body and return result', async () => {
    const body = { username: 'user' };
    const expected = { access_token: 'token' };
    mockService.login.mockResolvedValue(expected);

    const result = await controller.login(body as TokenInputDto);

    expect(mockService.login).toHaveBeenCalledWith(body);
    expect(result).toBe(expected);
  });
});
