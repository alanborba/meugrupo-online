import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (body.action === "click") {
    const { data: group } = await supabase
      .from("groups")
      .select("clicks")
      .eq("id", id)
      .single();

    if (group) {
      await supabase
        .from("groups")
        .update({ clicks: group.clicks + 1 })
        .eq("id", id);
    }

    return NextResponse.json({ success: true });
  }

  if (body.action === "promote") {
    const plan = body.plan;
    if (!["basic", "plus", "premium"].includes(plan)) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const daysMap: Record<string, number> = { basic: 7, plus: 15, premium: 30 };
    const expires = new Date();
    expires.setDate(expires.getDate() + daysMap[plan]);

    const { data, error } = await supabase
      .from("groups")
      .update({
        is_promoted: true,
        promotion_plan: plan,
        promotion_expires_at: expires.toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // Update group details
  if (body.action === "update") {
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.tags !== undefined) updateData.tags = body.tags;

    const { data, error } = await supabase
      .from("groups")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Erro ao atualizar grupo" }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Erro ao excluir grupo" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
