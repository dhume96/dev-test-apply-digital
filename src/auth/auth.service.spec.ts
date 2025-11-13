import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwt: { sign: jest.Mock };

  beforeEach(async () => {
    mockJwt = { sign: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should sign payload and return access_token', async () => {
    const user = { username: 'alice', userId: 'uid123' };
    const signed = 'signed-token';
    mockJwt.sign.mockReturnValue(signed);

    const result = await service.login(user);

    expect(mockJwt.sign).toHaveBeenCalledWith({ username: 'alice', sub: 'uid123' });
    expect(result).toEqual({ access_token: signed });
  });
});