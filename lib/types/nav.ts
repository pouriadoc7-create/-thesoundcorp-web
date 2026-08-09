export interface NavLink {
  /** Key into the "nav" translation namespace, e.g. messages/en.json's nav.home */
  key: "home" | "brands" | "products" | "gallery" | "downloads" | "about" | "contact";
  href: string;
}
