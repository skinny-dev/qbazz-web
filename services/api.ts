import type { Product, Store } from "../types";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

// Types based on qbazz-core API responses
type ApiProduct = {
  id: number;
  storeId: number;
  title: string;
  slug?: string;
  description?: string | null;
  longDescription?: string | null;
  images?: string[]; // Array of image URLs
  properties?: Record<string, any>;
  pricing?: Record<string, any>;
  colors?: string[];
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  store?: {
    id?: number;
    title?: string;
    slug?: string;
    avatar?: string | null;
    socials?: string | Record<string, any>;
  } | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

function persianToEnglishNumber(str: string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], "g"), i.toString());
    result = result.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  return result;
}

function toNumber(n?: string | number | null): number | undefined {
  if (n == null) return undefined;
  if (typeof n === "number") return n;

  // Convert Persian/Arabic digits to English
  const normalized = typeof n === "string" ? persianToEnglishNumber(n) : n;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function mapApiToUiProduct(p: ApiProduct): Product {
  // Parse pricing if it's a JSON string
  let pricing: any = {};
  try {
    pricing =
      typeof p.pricing === "string" ? JSON.parse(p.pricing) : p.pricing || {};
  } catch {
    pricing = p.pricing || {};
  }
  const price = toNumber(pricing.base_price) ?? toNumber(pricing.price) ?? 0;

  // Parse images if it's a JSON string
  let images: string[] = [];
  try {
    images =
      typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
  } catch {
    images = Array.isArray(p.images) ? p.images : [];
  }

  // Parse properties if it's a JSON string
  let properties: any = {};
  try {
    properties =
      typeof p.properties === "string"
        ? JSON.parse(p.properties)
        : p.properties || {};
  } catch {
    properties = p.properties || {};
  }

  // Convert properties object to details array
  const details = Object.entries(properties)
    .slice(0, 6)
    .map(([key, value]) => ({
      label: key,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
    }));

  // Get store name from socials.telegram or title
  let storeName = "فروشگاه";
  if (p.store) {
    if (p.store.title) {
      storeName = p.store.title;
    } else if (p.store.socials) {
      try {
        const socials =
          typeof p.store.socials === "string"
            ? JSON.parse(p.store.socials)
            : p.store.socials;
        storeName =
          socials?.telegram?.username ||
          socials?.telegram?.id ||
          p.store.title ||
          "فروشگاه";
      } catch {
        storeName = p.store.title || "فروشگاه";
      }
    }
  }

  const store: Store = {
    id: String(p.storeId ?? p.store?.id ?? ""),
    name: storeName,
    category: "بازار",
    location: "",
    logoUrl: p.store?.avatar || "",
    productCount: 0,
  };

  // Parse colors if it's a JSON string
  let colors: string[] = [];
  try {
    colors =
      typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors || [];
  } catch {
    colors = Array.isArray(p.colors) ? p.colors : [];
  }

  // Parse tags if it's a JSON string
  let tags: string[] = [];
  try {
    tags = typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags || [];
  } catch {
    tags = Array.isArray(p.tags) ? p.tags : [];
  }

  return {
    id: String(p.id),
    name: p.title,
    description: p.description || p.longDescription || "",
    price,
    images,
    colors,
    details,
    store,
    views: 0, // Views tracking not implemented yet
    category: tags.length > 0 ? tags[0] : "عمومی",
  };
}

export async function fetchProducts(limit = 24): Promise<Product[]> {
  const url = `${API_BASE}/api/products?limit=${encodeURIComponent(
    String(limit)
  )}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "QbazzWeb/1.0",
      Accept: "application/json",
      "Accept-Language": "fa-IR,fa;q=0.9",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch products: ${res.status} ${text}`);
  }
  const response: ApiResponse<ApiProduct[]> = await res.json();
  if (!response?.success || !Array.isArray(response.data)) return [];
  return response.data.map(mapApiToUiProduct);
}

export async function fetchStores(limit = 20): Promise<Store[]> {
  const url = `${API_BASE}/api/stores?limit=${encodeURIComponent(
    String(limit)
  )}&isApproved=true&isActive=true`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "QbazzWeb/1.0",
      Accept: "application/json",
      "Accept-Language": "fa-IR,fa;q=0.9",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch stores: ${res.status} ${text}`);
  }
  const response: ApiResponse<any[]> = await res.json();
  if (!response?.success || !Array.isArray(response.data)) return [];

  return response.data.map((store) => {
    let storeName = store.title || "فروشگاه";
    let socials: any = {};

    try {
      socials =
        typeof store.socials === "string"
          ? JSON.parse(store.socials)
          : store.socials || {};
    } catch {
      socials = {};
    }

    return {
      id: String(store.id),
      name: storeName,
      category: store.tags && store.tags.length > 0 ? store.tags[0] : "بازار",
      location: store.identity?.location?.city || "",
      logoUrl: store.avatar || "",
      productCount: store._count?.products || 0,
    };
  });
}

export async function searchProducts(
  query: string,
  limit = 24
): Promise<Product[]> {
  const url = `${API_BASE}/api/products/search?q=${encodeURIComponent(
    query
  )}&limit=${encodeURIComponent(String(limit))}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "QbazzWeb/1.0",
      Accept: "application/json",
      "Accept-Language": "fa-IR,fa;q=0.9",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to search products: ${res.status} ${text}`);
  }
  const response: ApiResponse<ApiProduct[]> = await res.json();
  if (!response?.success || !Array.isArray(response.data)) return [];
  return response.data.map(mapApiToUiProduct);
}

export type Category = {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
};

export async function fetchCategories(): Promise<Category[]> {
  const url = `${API_BASE}/api/categories`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "QbazzWeb/1.0",
      Accept: "application/json",
      "Accept-Language": "fa-IR,fa;q=0.9",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch categories: ${res.status} ${text}`);
  }
  const response: ApiResponse<Category[]> = await res.json();
  if (!response?.success || !Array.isArray(response.data)) return [];
  return response.data.filter((c) => c.isActive);
}
