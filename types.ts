export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
}

export interface Store {
  id: string;
  name: string;
  category: string;
  location: string;
  logoUrl: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: string[];
  details: { label: string; value: string }[];
  store: Store;
  views: number;
  category: string;
}

export type Page =
  | { name: "home" }
  | { name: "product"; data: Product }
  | { name: "store"; data: Store }
  | { name: "registerStore" };

export interface AppContextType {
  navigateTo: (page: Page) => void;
  categories: Category[];
  searchModal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}
