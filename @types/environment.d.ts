declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_URL: string;
        NODE_ENV: 'development' | 'production';
        MONGO_DB: string;
        PORT: number;
      }
    }
  }