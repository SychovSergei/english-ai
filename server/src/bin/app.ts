import express, { Request, Response } from 'express';
import { Express } from 'express';
import cookieParser from 'cookie-parser';

import { corsMiddleware, errorHandler, logRequestMiddleware } from '@infrastructure/http/middleware';
import { mainRouter } from '@infrastructure/http/routes/routes';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

// Middleware for logging requests
app.use(logRequestMiddleware);

app.use(corsMiddleware);

/** ALL ROUTES */
app.use('/api', mainRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is working!');
});

/** must be last middleware */
app.use(errorHandler); // as unknown as express.ErrorRequestHandler

export default app;

// app.get("/balance", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.openai.com/v1/models", {
//     // const response = await axios.get("https://api.openai.com/v1/usage", {
//     // const response = await axios.get("https://api.openai.com/dashboard/billing/credit_grants", {
//     // const response = await axios.get("https://api.openai.com/dashboard/billing/usage", {
//     // const response = await axios.get(
//     //   "https://api.openai.com/v1/dashboard/billing/usage?start_date=2023-05-01&end_date=2024-12-31",
//     //   {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           // "Content-Type": "application/json"
//         },
//         // params: {
//         //   date: "2024-11-24", // Пример даты, которую нужно передать
//         // },
//       },
//     );
//     res.json(response.data); // Отправляем данные напрямую в браузер
//   } catch (error: any) {
//     // Проверка и вывод подробностей ошибки
//     if (axios.isAxiosError(error)) {
//       console.error("Axios Error:", error.response?.data);
//       res.status(400).json({
//         error: "Bad Request",
//         message: error.response?.data || error.message,
//       });
//     } else {
//       console.error("Unexpected Error:", error);
//       res.status(500).json({
//         error: "Internal Server Error",
//         message: error.message || "Unknown error occurred",
//       });
//     }
//   }
// });

// (node:6480) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
// (Use `node --trace-deprecation ...` to show where the warning was created)
// Connected to MongoDB success
//     [server]: Server is running at PORT:3000
// Incoming request: POST /api/open-ai/generate-sentences
// Origin: undefined
// Received request: POST /api/open-ai/generate-sentences
// content >> RU: Пример - это отличный способ изучить новый материал.
//     UK: Приклад - це відмінний спосіб вивчити новий матеріал.
//
//     Translation:
// RU: An example is a great way to study new material.
// UK: Example is a great way to study new material.
//     parts [ 'RU: Пример - это отличный способ изучить новый материал.  ' ]
// parts [ 'UK: Приклад - це відмінний спосіб вивчити новий матеріал.  ' ]
// parts [ '' ]
// parts [ 'Translation:' ]
// parts [ 'RU: An example is a great way to study new material.  ' ]
// parts [ 'UK: Example is a great way to study new material.  ' ]
// parsedResponse {
//   sentences: [
//     {
//       word: 'example, study',
//       sentence: 'RU: Пример - это отличный способ изучить новый материал.  ',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'UK: Приклад - це відмінний спосіб вивчити новий матеріал.  ',
//       translations: {}
//     },
//     { word: 'example, study', sentence: '', translations: {} },
//     {
//       word: 'example, study',
//       sentence: 'Translation:',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'RU: An example is a great way to study new material.  ',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'UK: Example is a great way to study new material.  ',
//       translations: {}
//     }
//   ]
// }
// result sentences {
//   sentences: [
//     {
//       word: 'example, study',
//       sentence: 'RU: Пример - это отличный способ изучить новый материал.  ',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'UK: Приклад - це відмінний спосіб вивчити новий матеріал.  ',
//       translations: {}
//     },
//     { word: 'example, study', sentence: '', translations: {} },
//     {
//       word: 'example, study',
//       sentence: 'Translation:',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'RU: An example is a great way to study new material.  ',
//       translations: {}
//     },
//     {
//       word: 'example, study',
//       sentence: 'UK: Example is a great way to study new material.  ',
//       translations: {}
//     }
//   ]
// }
