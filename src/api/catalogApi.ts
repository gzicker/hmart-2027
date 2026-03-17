import { vtexFetch } from './vtexConfig';

export interface VtexCategory {
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  children: VtexCategory[];
  Title: string;
  MetaTagDescription: string;
}

export async function getCategoryTree(depth: 1 | 2 | 3 = 3): Promise<VtexCategory[]> {
  return vtexFetch<VtexCategory[]>(`/api/catalog_system/pub/category/tree/${depth}`);
}

export function flattenCategoryTree(tree: VtexCategory[], parentPath: string[] = []): Array<VtexCategory & { path: string[]; depth: number }> {
  const result: Array<VtexCategory & { path: string[]; depth: number }> = [];
  for (const cat of tree) {
    const currentPath = [...parentPath, cat.name];
    result.push({ ...cat, path: currentPath, depth: currentPath.length });
    if (cat.children?.length) {
      result.push(...flattenCategoryTree(cat.children, currentPath));
    }
  }
  return result;
}
