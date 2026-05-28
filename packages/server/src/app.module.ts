import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { BannersModule } from './modules/banners/banners.module';
import { TagsModule } from './modules/tags/tags.module';
import { ActorsModule } from './modules/actors/actors.module';
import { UploadModule } from './modules/upload/upload.module';
import { SearchModule } from './modules/search/search.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DanmakuModule } from './modules/danmaku/danmaku.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', 'root'),
        database: config.get('DB_DATABASE', 'chunyu_cms'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        charset: 'utf8mb4',
        logging: process.env.NODE_ENV !== 'production',
        extra: {
          connectionLimit: 20,
          acquireTimeout: 10000,
          timeout: 60000,
        },
      }),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    VideosModule,
    MoviesModule,
    CategoriesModule,
    CommentsModule,
    FavoritesModule,
    RatingsModule,
    BannersModule,
    TagsModule,
    ActorsModule,
    UploadModule,
    SearchModule,
    DashboardModule,
    AuditModule,
    NotificationsModule,
    DanmakuModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
