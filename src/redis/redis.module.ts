import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide:'REDIS_CLIENT',
      async useFactory(configService:ConfigService) {
            const client = createClient({
              socket:{
                host:configService.get('redis_server_host'),
                port:configService.get('redis_server_port')
              },
              database:configService.get('redis_server_database')
            })
            await client.connect()
            return client
      },
      inject:[ConfigService]
    },
    RedisService
  ],
  exports:[RedisService]
})
export class RedisModule {}
