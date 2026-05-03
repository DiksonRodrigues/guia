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
