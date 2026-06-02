import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Usuario } from './entities/usuario.entity';
import { TipoUsuario } from './entities/tipo-usuario.entity';
import { Formacion, Jornada } from './entities/formacion.entity';
import { TipoUsuarioEnum } from '../common/enums/tipo-usuario.enum';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepository: Repository<TipoUsuario>,
    @InjectRepository(Formacion)
    private readonly formacionRepository: Repository<Formacion>,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureTiposUsuario();
      await this.ensureFormaciones();

      const correoAdmin = 'admin@sistema.com';
      const documentoAdmin = '123456789';
      const contraAdmin = 'Admin123*';
      const saltRounds = 10;

      const existente = await this.usuarioRepository.findOne({
        where: { correo: correoAdmin },
        withDeleted: true,
      });

      if (existente) {
        if (existente.documento !== documentoAdmin) {
          this.logger.warn('Usuario ADMIN de inicialización ya existe con documento distinto (omitido).');
          return;
        }

        const wasDeleted = Boolean(existente.deletedAt);
        if (existente.deletedAt) {
          await this.usuarioRepository.restore({ documento: existente.documento });
        }

        const usuario = wasDeleted
          ? await this.usuarioRepository.findOne({ where: { correo: correoAdmin }, withDeleted: true })
          : existente;

        if (!usuario) {
          this.logger.warn('Usuario ADMIN de inicialización no se pudo recargar tras restauración (omitido).');
          return;
        }

        const requiereCambioRol = usuario.idTipoUsr !== TipoUsuarioEnum.ADMIN;
        const passwordMatch = await bcrypt.compare(contraAdmin, usuario.contra);
        const requiereCambioContra = !passwordMatch;
        const requiereDefaults =
          !usuario.fotoPersona ||
          !usuario.numTelf ||
          !usuario.contactoEmerg ||
          !usuario.qr;

        if (!requiereCambioRol && !requiereCambioContra && !requiereDefaults && !wasDeleted) {
          this.logger.log('Usuario ADMIN de inicialización ya existe y credenciales están correctas (omitido).');
          return;
        }

        if (requiereCambioRol) {
          usuario.idTipoUsr = TipoUsuarioEnum.ADMIN;
        }

        if (requiereCambioContra) {
          usuario.contra = await bcrypt.hash(contraAdmin, saltRounds);
        }

        if (!usuario.fotoPersona) {
          usuario.fotoPersona = '';
        }

        if (!usuario.numTelf) {
          usuario.numTelf = '3000000000';
        }

        if (!usuario.contactoEmerg) {
          usuario.contactoEmerg = '3000000000';
        }

        if (!usuario.qr) {
          usuario.qr = randomUUID();
        }

        usuario.idFormacion = null;
        usuario.pushToken = null;

        const actualizado = await this.usuarioRepository.save(usuario);
        this.logger.log(
          `Usuario ADMIN de inicialización actualizado (rol=${actualizado.idTipoUsr}, contra=${requiereCambioContra ? 'actualizada' : 'ok'}).`,
        );
        return;
      }

      const hash = await bcrypt.hash(contraAdmin, saltRounds);

      const admin = this.usuarioRepository.create({
        documento: documentoAdmin,
        nombreCompleto: 'Administrador Principal',
        correo: correoAdmin,
        contra: hash,
        idTipoUsr: TipoUsuarioEnum.ADMIN,
        fotoPersona: '',
        numTelf: '3000000000',
        contactoEmerg: '3000000000',
        idFormacion: null,
        qr: randomUUID(),
        pushToken: null,
      });

      await this.usuarioRepository.save(admin);
      this.logger.log('Usuario ADMIN de inicialización creado.');
    } catch (error: any) {
      this.logger.error('Seeding de usuario admin falló (omitido).', error?.stack || String(error));
    }
  }

  private async ensureTiposUsuario() {
    const seeds: Array<Pick<TipoUsuario, 'idTipoUsr' | 'tipoUsr'>> = [
      { idTipoUsr: TipoUsuarioEnum.APRENDIZ, tipoUsr: 'Usuario' },
      { idTipoUsr: TipoUsuarioEnum.ADMIN, tipoUsr: 'Administrador' },
      { idTipoUsr: TipoUsuarioEnum.OPERATIVO, tipoUsr: 'Personal Operativo' },
    ];

    for (const seed of seeds) {
      const existing = await this.tipoUsuarioRepository.findOne({
        where: { idTipoUsr: seed.idTipoUsr },
        withDeleted: true,
      });

      if (existing) {
        if (existing.deletedAt) {
          await this.tipoUsuarioRepository.restore({ idTipoUsr: existing.idTipoUsr });
        }
        if (existing.tipoUsr !== seed.tipoUsr) {
          existing.tipoUsr = seed.tipoUsr;
          await this.tipoUsuarioRepository.save(existing);
        }
        continue;
      }

      const created = this.tipoUsuarioRepository.create(seed);
      await this.tipoUsuarioRepository.save(created as TipoUsuario);
    }
  }

  private async ensureFormaciones() {
    const seeds: Array<Formacion> = [
      this.formacionRepository.create({
        ficha: '3066600',
        nombre: 'ADSO',
        ambiente: '4109',
        jornada: Jornada.MANANA,
      }),
    ];

    for (const seed of seeds) {
      const existing = await this.formacionRepository.findOne({
        where: { ficha: seed.ficha },
        withDeleted: true,
      });

      if (existing) {
        if (existing.deletedAt) {
          await this.formacionRepository.restore({ ficha: existing.ficha });
        }
        if (
          existing.nombre !== seed.nombre ||
          existing.ambiente !== seed.ambiente ||
          existing.jornada !== seed.jornada
        ) {
          existing.nombre = seed.nombre;
          existing.ambiente = seed.ambiente;
          existing.jornada = seed.jornada;
          await this.formacionRepository.save(existing);
        }
        continue;
      }

      await this.formacionRepository.save(seed);
    }
  }
}
