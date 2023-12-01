import { Global, Logger, Module } from '@nestjs/common';
import knex from 'knex';
import knexConfig from '../../knexfile';

const logger = new Logger('DBConnection');

const knexProvider = {
  provide: 'DBConnection', // 'DbConnection' to nasz pomysł na nazwę tokena, może być dowolna!
  useFactory: async (): Promise<knex.Knex> => {
    const connection = knex(knexConfig['development']);
    logger.log('Knex connected');
    logger.debug(knexConfig['development']);

    return connection;
  },
};

@Global() // Chcemy, żeby każdy, kto poprosi o połączenie, dostał provider!
@Module({
  providers: [knexProvider],
  exports: [knexProvider], // Udostępnij provider
})
export class DatabaseModule {}
