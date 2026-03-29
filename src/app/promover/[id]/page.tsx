"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PLANS } from "@/lib/plans";
import type { Group } from "@/lib/store";

export default function PromoverPage() {
  const params = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [qrCode64, setQrCode64] = useState<string | null>(null);
  const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/groups/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleGeneratePix = async () => {
    if (!selectedPlan || !group) return;
    setProcessing(true);

    try {
      const res = await fetch('/api/payments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id, planId: selectedPlan }),
      });

      const data = await res.json();

      if (data.qr_code_base64) {
        setQrCode64(data.qr_code_base64);
        setQrCodeLink(data.qr_code);
      } else {
        alert(data.error || "Erro. Verifique a chave MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente.");
      }
    } catch (error) {
      console.error(error);
      alert("Falha na geração do PIX. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (qrCodeLink) {
      navigator.clipboard.writeText(qrCodeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl w-20 h-20 animate-pulse" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            Grupo não encontrado
          </h2>
          <button
            onClick={() => router.push("/explorar")}
            className="mt-4 px-6 py-3 rounded-xl gradient-bg text-white font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="hero-bg min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-12 text-center max-w-md w-full animate-count-up">
          <span className="text-7xl block mb-6">🎊</span>
          <h2 className="text-2xl font-bold text-white mb-3">
            Grupo promovido com sucesso!
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-8">
            Seu grupo &ldquo;{group.name}&rdquo; agora aparece no topo da listagem!
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/grupo/${group.id}`)}
              className="px-8 py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30"
            >
              Ver meu grupo →
            </button>
            <button
              onClick={() => router.push("/explorar")}
              className="px-8 py-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all"
            >
              Explorar grupos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Promover <span className="gradient-text-pink">{group.name}</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm max-w-lg mx-auto">
            Escolha um plano para impulsionar seu grupo ao topo da listagem e atrair mais membros!
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isPopular = "popular" in plan && plan.popular;

            return (
              <button
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setQrCode64(null);
                  setQrCodeLink(null);
                }}
                className={`relative glass rounded-2xl p-8 text-left transition-all hover:scale-[1.03] ${isSelected
                    ? "border-2 border-[var(--color-accent-primary)] shadow-2xl scale-[1.03]"
                    : ""
                  } ${isPopular ? "md:-translate-y-4" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold gradient-bg text-white shadow-lg">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <span className="text-4xl block mb-3">{plan.emoji}</span>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold gradient-text">
                      R${plan.price}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm">
                      /{plan.days} dias
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="text-[var(--color-accent-green)] mt-0.5 shrink-0">
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <div
                  className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${isSelected
                      ? "gradient-bg text-white shadow-lg"
                      : "bg-white/5 text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                    }`}
                >
                  {isSelected ? "✓ Selecionado" : "Selecionar"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Area */}
        {selectedPlan && (
          <div className="max-w-md mx-auto animate-count-up">
            <div className="glass rounded-2xl p-8 text-center border-t-4 border-[var(--color-accent-primary)]">
              <h3 className="text-lg font-bold text-white mb-1">Pagar via PIX</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-6">
                Plano: <strong className="text-white">{PLANS.find((p) => p.id === selectedPlan)?.name}</strong> —
                R${PLANS.find((p) => p.id === selectedPlan)?.price},00
              </p>

              <div className="glass rounded-xl p-5 mb-6">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center p-2 mb-4 overflow-hidden shadow-inner">
                  {qrCode64 ? (
                    <img src={`data:image/jpeg;base64,${qrCode64}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <span className="text-xs uppercase font-bold tracking-widest block opacity-70">Aguardando...</span>
                    </div>
                  )}
                </div>

                {qrCodeLink ? (
                  <div className="animate-fade-in-scale">
                    <p className="text-xs text-[var(--color-text-muted)] mb-2 font-medium">PIX Copia e Cola:</p>
                    <div className="flex bg-black/40 border border-[var(--color-border)] rounded-xl overflow-hidden focus-within:border-[var(--color-accent-primary)] transition-colors">
                      <input
                        type="text"
                        readOnly
                        value={qrCodeLink}
                        className="flex-1 bg-transparent px-3 py-3 text-xs text-[var(--color-text-secondary)] font-mono outline-none"
                        onClick={(e) => e.currentTarget.select()}
                      />
                      <button
                        onClick={handleCopy}
                        className="px-4 gradient-bg text-xs font-bold text-white shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1"
                      >
                        {copied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <div className="mt-5 text-center">
                      <p className="text-xs text-[var(--color-accent-green)] font-semibold flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-green)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-green)]"></span>
                        </span>
                        Aguardando pagamento...
                      </p>

                      {/* Botão temporário para aprovar visualmente e finalizar o UX */}
                      <button
                        onClick={() => setSuccess(true)}
                        className="mt-6 text-[10px] text-[var(--color-text-muted)] underline hover:text-[var(--color-text-primary)] transition-colors"
                        title="Isso é pra você testar o fluxo sem precisar pagar, mas em Produção, seria automático via Webhook."
                      >
                        Simular pagamento automático (Dev Mode)
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Abra o app do seu banco e escaneie o código que será gerado.
                  </p>
                )}
              </div>

              {!qrCodeLink && (
                <button
                  onClick={handleGeneratePix}
                  disabled={processing}
                  className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-primary)]/30 disabled:opacity-50"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Gerando PIX...
                    </span>
                  ) : (
                    "Gerar Pagamento"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
