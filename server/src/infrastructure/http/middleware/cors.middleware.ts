import cors, { CorsOptions } from 'cors';

const whiteList = [
  'http://127.0.0.1:8888',
  'http://localhost:4200',
  'http://localhost:3000',
  'https://english-ai-learn.netlify.app',
];
export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log('Origin:', origin);
    // Разрешить пустой origin (для тестирования с Postman)
    if (
      !origin || // for Postman
      whiteList.indexOf(<string>origin) !== -1 || // for specific domains
      origin.startsWith('http://192.168.') // for local devices
    ) {
      console.log('Request is Allowed by CORS.');
      callback(null, true);
    } else {
      callback(new Error('Request is Blocked by CORS.'));
    }
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
