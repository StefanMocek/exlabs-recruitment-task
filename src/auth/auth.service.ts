import { AuthUserDto } from './dtos/auth.user.dto';
import { AuthUserService, authUserService } from './auth-user/auth.user.service';
import { AuthenticationService } from '../utils/services/authentication.service';
import { BadRequestError } from '../utils/errors';

export class AuthService {
  constructor(public authUserService: AuthUserService, public authenticationService: AuthenticationService) {}

  async register(createAuthUserDto: AuthUserDto): Promise<BadRequestError | { jwt: string }> {
    const existingAuthUser = await this.authUserService.findOneByEmail(createAuthUserDto.email);
    if (existingAuthUser) {
      return new BadRequestError('Email already taken');
    }

    const newAuthUser = await this.authUserService.create(createAuthUserDto);

    const jwt = this.authenticationService.generateJwt(
      { email: createAuthUserDto.email, userId: newAuthUser._id },
      process.env.JWT_KEY!,
    );
    return { jwt };
  }

  async signin(signInDto: AuthUserDto): Promise<BadRequestError | { jwt: string }> {
    const authUser = await this.authUserService.findOneByEmail(signInDto.email);
    if (!authUser) {
      return new BadRequestError('Wrong credentials');
    }

    const pwdCompered = await this.authenticationService.passwordCompare(authUser.password, signInDto.password);
    if (!pwdCompered) {
      return new BadRequestError('Wrong credentials');
    }

    const jwt = this.authenticationService.generateJwt(
      { email: authUser.email, userId: authUser._id },
      process.env.JWT_KEY!,
    );
    return { jwt };
  }
}

export const authService = new AuthService(authUserService, new AuthenticationService());
