import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Client genérico
import { createClient } from "@/utils/supabase/server"; // SSR Client
import { z } from "zod";

const UpdateGroupSchema = z.object({
  name: z.string().min(3).max(60).regex(/^[a-zA-Z0-9À-ÖØ-öø-ÿ\s\-_.,!?]+$/, "Letras inválidas").optional(),
  description: z.string().min(10).max(300).refine(val => !/<[^>]*>?/gm.test(val), "Proibido tags HTML").optional(),
  link: z.string().url("URL inválida").optional(),
  category: z.string().min(3).max(30).optional(),
  image_url: z.string().url().max(500).optional().or(z.literal("")),
  tags: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)).max(10).optional()
});

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

  // 1. AÇÃO PÚBLICA: 'click' (não requer autenticação, mas tem rate limit pelo middleware)
  if (body.action === "click") {
    // Usamos RLS do BD no modo service role ou definimos uma RPC para incrementar click de forma atômica
    // Para simplificar, mantemos a leitura e gravação, mas num ambiente enterprise real se usa chamadas RPC
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

  // 2. AÇÕES PRIVADAS: Atualização de Dados
  // A ação 'promote' foi sumariamente removida! Promoções agora APENAS OCORREM VIA WEBHOOK SEGURO
  if (body.action === "update") {
     const secureSupabase = await createClient();
     const { data: { user } } = await secureSupabase.auth.getUser();

     if (!user) {
        return NextResponse.json({ error: "Acesso não autorizado - Sessão Inválida." }, { status: 401 });
     }

     // Valida o body com Zod
     const parseResult = UpdateGroupSchema.safeParse(body);
     if (!parseResult.success) {
        return NextResponse.json(
          { error: "Dados inválidos/maliciosos ignorados.", details: parseResult.error.format() },
          { status: 400 }
        );
     }
     
     const updateData = parseResult.data;

     // Segurança: Exige que na hora de fazer o patch, o user_id seja o mesmo do cara logado (reforçando o RLS no servidor)
     const { data, error } = await secureSupabase
       .from("groups")
       .update(updateData)
       .eq("id", id)
       .eq("user_id", user.id) // OBRIGATÓRIO SER O DONO
       .select()
       .single();

     if (error || !data) {
       return NextResponse.json({ error: "Erro ao atualizar ou você não tem permissão." }, { status: 403 });
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
  
  // Confirma Identidade Server-side
  const secureSupabase = await createClient();
  const { data: { user } } = await secureSupabase.auth.getUser();

  if (!user) {
     return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  // Só apaga se for realmente o dono
  const { error } = await secureSupabase
    .from("groups")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); 

  if (error) {
    return NextResponse.json({ error: "Erro ao excluir grupo ou permissão negada" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
