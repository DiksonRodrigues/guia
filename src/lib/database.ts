import { supabase } from "./supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  
  if (error) throw error;
  return data;
}

export async function getFeaturedBusinesses() {
  const { data, error } = await supabase
    .from("businesses")
    .select(`
      *,
      categories (name)
    `)
    .eq("featured", true)
    .limit(20);
  
  if (error) throw error;
  return data;
}

export async function getBusinessesByCategory(categorySlug: string) {
  // First get category id
  const { data: catData, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", categorySlug)
    .single();
  
  if (catError) throw catError;

  const { data, error } = await supabase
    .from("businesses")
    .select(`
      *,
      categories (name)
    `)
    .eq("category_id", catData.id);
  
  if (error) throw error;
  return { businesses: data, category: catData };
}

export async function getCoupons() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("coupons")
    .select(`
      *,
      businesses (name, whatsapp, slug)
    `)
    .eq("active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function getBusinessBySlug(slug: string) {
  const { data, error } = await supabase
    .from("businesses")
    .select(`
      *,
      categories (name),
      business_products (name, price, image_url)
    `)
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getSupermarkets() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("supermarkets")
    .select(`
      *,
      flyers (id, valid_from, valid_until, active)
    `)
    .eq("active", true)
    .order("name");
  if (error) throw error;
  return (data ?? []).map((s: any) => ({
    ...s,
    activeFlyer: s.flyers?.find((f: any) => f.active && f.valid_until >= today) ?? null,
  }));
}

export async function getSupermarketBySlug(slug: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("supermarkets")
    .select(`
      *,
      flyers (
        id, valid_from, valid_until, pages, active,
        flyer_highlights (id, product_name, original_price, sale_price, image_url)
      )
    `)
    .eq("slug", slug)
    .eq("active", true)
    .single();
  if (error) throw error;
  const activeFlyer = data.flyers?.find((f: any) => f.active && f.valid_until >= today) ?? null;
  return { ...data, activeFlyer };
}
