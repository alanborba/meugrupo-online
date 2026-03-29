import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="text-lg font-bold gradient-text">MeuGrupo.Online</span>
            </div>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              A maior plataforma para divulgar e descobrir grupos de WhatsApp, Telegram, Discord e muito mais.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/explorar" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">
                  Explorar Grupos
                </Link>
              </li>
              <li>
                <Link href="/adicionar" className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm">
                  Adicionar Grupo
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Categorias
            </h3>
            <ul className="space-y-2">
              {["WhatsApp", "Telegram", "Discord", "Facebook"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/explorar?categoria=${cat.toLowerCase()}`}
                    className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm"
                  >
                    Grupos de {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center">
          <p className="text-[var(--color-text-muted)] text-xs">
            © {new Date().getFullYear()} MeuGrupo.Online — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
