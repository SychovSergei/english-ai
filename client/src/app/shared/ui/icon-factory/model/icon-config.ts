export interface IconConfig {
  type: 'mat' | 'fawesome' | 'custom'; // расширяем при необходимости
  name: string; // иконка или название
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // для доп. опций (например, стиль, цвет и т.п.)
}
