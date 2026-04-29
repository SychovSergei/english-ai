# english-ai
English training app - Angular + Node Express + openai



infrastructure

  |-- infrastructure             
  |       |---- database
  |       |          |----entities/models        (Models MongoDB Mongoose)
  |       |          |----repositories           (Реализация репозиториев (работа с MongoDB через Mongoose))
  |       |---- di                               (контейнер общий для внедрения через DI)
  |       |---- http                             (роуты, контроллеры, middlewares)
  |
  |-- application             (Application Services)
  |       |----
  |
  |
  |----core
  |       |
  |       |----domain
  |       |       |
  |       |       |----entities
  |       |       |----enums
  |       |       |----errors
  |       |       |----utils
  |       |       |----/services  👈 Доменные сервисы (Domain Services) — это классы, содержащие бизнес-логику, которая не относится к одной конкретной сущности, а работает с несколькими сущностями сразу.
  |       |                         ✅ Этот сервис не использует базу данных
  |       |                         ✅ Не зависит от инфраструктуры
  |       |                         ✅ Работает с бизнес-логикой (WordProgressService - готов ли пользователь к следующему этапу изучения)
  |       |
  |       |----interfaces     (интерфейсы для сервисов)
  |       |----repositories   (интерфейсы для сервисов API (без реализации))
  |       |----services       (сервисы ??????)
