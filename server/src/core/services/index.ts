export { TokenService } from './token.service';
export { UserSettingsService } from './user-settings.service';
// TODO Здесь нужно аккуратно. Если TokenService, UserSettingsService, OpenAiService завязаны на
//  сторонние библиотеки (например JWT, OpenAI SDK) — то это уже инфраструктура, и им было бы
//  место в src/infrastructure.
//  Но если это чистая логика без внешних зависимостей — тогда нормально.
//  ➔ Можно подумать о переносе некоторых сервисов в инфраструктуру для ещё большей чистоты.
//  -----
//  Рассмотреть перенос зависимых от инфраструктуры сервисов (TokenService, OpenAiService) из
//  core/services в infrastructure/services.
//  — Либо их нужно "очистить" от привязки к библиотекам.

// TODO Небольшая проблема:
//  src/core/services/ — это ближе к application, а не к core/domain.
//  ➔ Лучше перенести эти сервисы (TokenService и т.д.) в src/application/services/, потому что они используют инфраструктуру, но являются частью бизнес-логики.
//  Что ещё нужно:
//  Добавить src/application/use-cases/ — чтобы четко разделить операции по сценарию (UseCase) от фасадов (сервисов).
