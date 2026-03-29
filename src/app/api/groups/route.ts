import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Client genérico
import { createClient } from "@/utils/supabase/server"; // SSR Client
import { z } from "zod";

// Zod Schema extremamente restritivo (Anti-XSS & Anti-Injection)
const GroupSchema = z.object({
  name: z.string().min(3).max(60).regex(/^[a-zA-Z0-9À-ÖØ-öø-ÿ\s\-_.,!?]+$/, "Letras inválidas"),
  description: z.string().min(10).max(300).refine(val => !/<[^>]*>?/gm.test(val), "Proibido tags HTML"),
  link: z.string().url("URL inválida"),
  category: z.string().min(3).max(30),
  image_url: z.string().url().max(500).optional().or(z.literal("")),
  tags: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)).max(10).optional()
  // Note: user_id, is_promoted, and clicks are NOT parsed from the request body. They are inferred or static.
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const userId = searchParams.get("user_id") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Math.min(Number(searchParams.get("limit")) || 12, 50); // Hard limit na paginação para evitar extração DUMP de DB
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

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (category && category !== "todos") {
    query = query.ilike("category", category);
  }

  if (search) {
    // Sanitização super básica para a Query Ilike
    const sanitizedSearch = search.replace(/[%_\\]/g, "");
    query = query.or(
      `name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
    );
  }

  // Order: promoted first, then by clicks
  query = query
    .order("is_promoted", { ascending: false })
    .order("clicks", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }

  return NextResponse.json({
    groups: data || [],
    total: count || 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validar a sessão servidor real (SSR Auth via JWT)
    const secureSupabase = await createClient();
    const { data: { user } } = await secureSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Você precisa estar logado (Token Inválido/Expirado)" }, { status: 401 });
    }

    const body = await request.json();

    // 2. Validação Restrita com Zod (Joga erro 400 se injetarem código)
    const parseResult = GroupSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos ou perigosos injetados.", details: parseResult.error.format() },
        { status: 400 }
      );
    }
    const cleanData = parseResult.data;

    // 3. Montar Inserção Garantindo Identidade Segura
    const insertData: Record<string, unknown> = {
      name: cleanData.name,
      description: cleanData.description,
      link: cleanData.link,
      category: cleanData.category.toLowerCase(),
      image_url: cleanData.image_url || null, // null is safer than empty string based on typical schema
      tags: cleanData.tags || [],
      clicks: 0,
      is_promoted: false,
      user_id: user.id, // IDENTITY IS PULLED FROM SERVER JWT, NOT FROM CLIENT JSON
    };

    const { data, error } = await secureSupabase
      .from("groups")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "Falha na inserção no banco de dados." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: "Requisição mal formatada (DDoS protection)." }, { status: 400 });
  }
}
