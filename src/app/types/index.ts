export interface SubMenuItem {
  id: string;
  label: string;
  endpointId: string;
}

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  submenu?: SubMenuItem[];
}
