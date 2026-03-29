import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { PLANS } from "@/lib/plans";

// Aqui vamos obter a chave de acesso do Mercado Pago configurada nas variáveis do seu projeto
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '', 
  options: { timeout: 5000 } 
});

export async function POST(request: Request) {
  try {
    const { groupId, planId, userEmail = "cliente@meugrupo.online" } = await request.json();
    
    if (!groupId || !planId) {
      return NextResponse.json({ error: "Parâmetros obrigatórios ausentes." }, { status: 400 });
    }

    // Valida o plano
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Plano selecionado inválido." }, { status: 400 });
    }

    const payment = new Payment(client);
    
    // Referência do pagamento (ajuda depois se precisarmos identificar do que se trata)
    const externalRef = `${groupId}|${planId}|${Date.now()}`;
    
    // Criação da intenção de PIX
    const response = await payment.create({
      body: {
        transaction_amount: plan.price,
        description: `Promoção na plataforma (Plano ${plan.name})`,
        payment_method_id: "pix",
        payer: {
          email: userEmail, // O MP precisa de um email para processar o PIX
        },
        external_reference: externalRef,
      }
    });

    // Pega as imagens/dados essenciais para o Frontend usar
    const pointOfInteraction = response.point_of_interaction?.transaction_data;

    return NextResponse.json({
      id: response.id,
      qr_code_base64: pointOfInteraction?.qr_code_base64,
      qr_code: pointOfInteraction?.qr_code,
      status: response.status
    });
    
  } catch (error: any) {
    console.error("Erro gerando o PIX no Mercado Pago:", error);
    return NextResponse.json({ error: "Falha na comunicação com o Mercado Pago.", details: error.message }, { status: 500 });
  }
}
