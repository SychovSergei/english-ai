import { IconConfig } from '@shared/ui/icon-factory/model/icon-config';

import { Injectable, Type, ViewContainerRef } from '@angular/core';

import { CustomIconComponent, FontAwesomeIconComponent, MaterialIconComponent } from '../ui';

export type IIconType = 'mat' | 'fawesome' | 'custom';

type IconComponentMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in IconConfig['type']]: Type<any>;
};

@Injectable({
  providedIn: 'root',
})
export class IconFactoryService {
  private readonly componentMap: IconComponentMap = {
    mat: MaterialIconComponent,
    fawesome: FontAwesomeIconComponent,
    custom: CustomIconComponent,
  };

  constructor() {}

  createIcon(container: ViewContainerRef, config: IconConfig): void {
    container.clear();
    const componentType = this.componentMap[config.type];
    if (!componentType) throw new Error(`Unsupported icon type: ${config.type}`);

    const componentRef = container.createComponent(componentType);
    componentRef.instance.data = config.name;

    Object.keys(config).forEach((key) => {
      if (key !== 'type' && key !== 'name' && key in componentRef.instance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (componentRef.instance as any)[key] = config[key];
      }
    });
  }

  // createIcon(container: ViewContainerRef, icon: string, type: IIconType): void {
  //   container.clear();
  //
  //   let componentType: Type<MaterialIconComponent>;
  //   switch (type) {
  //     case 'mat':
  //       componentType = MaterialIconComponent;
  //       break;
  //     case 'fawesome':
  //       componentType = FontAwesomeIconComponent;
  //       break;
  //     case 'custom':
  //       componentType = CustomIconComponent;
  //       break;
  //     default:
  //       throw new Error('Unknown icon type');
  //   }
  //   const componentRef = container.createComponent(componentType);
  //   componentRef.instance.data = icon;
  // }
}
