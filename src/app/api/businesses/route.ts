import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const PAGE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));
  const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? String(PAGE), 10)));

  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, slug, description, image_url, rating, discount_label, featured, categories(name), neighborhoods(name, slug)")
    .order("featured", { ascending: false })
    .order("name")
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
