import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMSG } from 'src/common/constants';
import { ClientProxySuperFlights } from './../common/proxy/client-proxy';
import { UserDTO } from 'src/user/dto/user.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}

  private _clientProxyUser = this.clientProxy.clientProxyUsers();
  async validateUser(username: string, password: string): Promise<any> {
    const user = await firstValueFrom(
      this._clientProxyUser.send(UserMSG.VALID_USER, {
        username,
        password,
      }),
    ).then((value) => {
      return value;
    });

    if (user) return user;

    return null;
  }

  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return await firstValueFrom(
      this._clientProxyUser.send(UserMSG.CREATE, userDTO),
    ).then((value) => {
      return value;
    });
  }
}
