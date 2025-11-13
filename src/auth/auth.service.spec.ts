import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwt: { sign: jest.Mock };

  beforeEach(async () => {
    mockJwt = { sign: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: mockJwt }],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should sign payload and return access_token', () => {
    const user = { username: 'alice' };
    const signed = 'signed-token';
    mockJwt.sign.mockReturnValue(signed);

    const result = service.login(user);

    expect(mockJwt.sign).toHaveBeenCalledWith({
      username: 'alice',
      sub: '0.123456789',
    });
    expect(result).toEqual({ access_token: signed });
  });
});
