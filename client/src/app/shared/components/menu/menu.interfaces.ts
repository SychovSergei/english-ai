interface IBaseMenuItem {
  title: string;
  iconSource: TIconType;
  active: boolean;
  // url?: string,
  // submenu?: { title: string, url: string }[]
}


interface IMenuWithUrl extends IBaseMenuItem {
  url: string;
  submenu?: never;
}
interface IMenuWithSubmenu extends IBaseMenuItem {
  url?: never;
  submenu: { title: string, url: string }[];
}

export type MenuItem = IMenuWithUrl | IMenuWithSubmenu;

export type Config = {
  multi?: boolean
};

type TIconType = IMatIconType | IAwesomeIconType;

interface IMatIconType {
  type: "mat-icon",
  matIconData: {
    iconCode: string
  }
}
interface IAwesomeIconType {
  type: "fontawesome",
  matIconData: {
    iconClass: string
  }
}
