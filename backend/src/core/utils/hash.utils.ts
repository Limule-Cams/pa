import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashUtils {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    return await bcrypt.compare(password, hashedPassword);
  }
}
