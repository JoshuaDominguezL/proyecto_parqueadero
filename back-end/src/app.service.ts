import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  estadoCon(): string {
    return 'Conexion Exitosa';
  }
}
