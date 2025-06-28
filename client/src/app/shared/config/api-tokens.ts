import { InjectionToken } from '@angular/core';

// TODO
//  если он разный для каждого модуля тогда оставить
//  если одинаковый то можно просто в http-api.service использовать переменную в пути
//  для каждого сервиса взаимодействующего с сервером есть всой сервис для работы с api
export const API_DOMAIN = new InjectionToken<string>('API_DOMAIN');
// export const API_MODULE_URL = new InjectionToken<string>('API_MODULE_URL');
