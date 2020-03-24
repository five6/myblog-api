export class Config {
  static uploadDir = 'upload';
  static api_prefix = 'api/v1';
  static mongo_db = 'mongodb://localhost/mylog';
  static mongo_files = 'mongodb://localhost/mylog_files';

  static redisOptions = {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  };
}
