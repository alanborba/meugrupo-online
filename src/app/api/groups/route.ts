import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const offset = (page - 1) * limit;

  // Check and expire promotions
  const now = new Date().toISOString();
  await supabase
    .from("groups")
    .update({ is_promoted: false, promotion_plan: null })
    .eq("is_promoted", true)
    .lt("promotion_expires_at", now);

  // Build query
  let query = supabase.from("groups").select("*", { count: "exact" });

  if (category && category !== "todos") {
    query = query.ilike("category", category);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  // Order: promoted first (premium > plus > basic), then by clicks
  query = query
    .order("is_promoted", { ascending: false })
    .order("clicks", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    groups: data || [],
    total: count || 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, link, category, image_url, tags } = body;

    if (!name || !description || !link || !category) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, description, link, category" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("groups")
      .insert({
        name,
        description,
        link,
        category: category.toLowerCase(),
        image_url: image_url || "",
        tags: tags || [],
        clicks: 0,
        is_promoted: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
}
