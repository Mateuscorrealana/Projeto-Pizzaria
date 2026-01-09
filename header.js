// header.js — versão robusta: delegação + observer + DOMContentLoaded
(function () {
    "use strict";

    // mapeamento de rótulos -> arquivo destino (tente corresponder por substring, case-insensitive)
    const PAGE_MAP = [
        { key: "sobre", href: "sobre.html" },
        { key: "cardápio", href: "cardápio.html" },
        { key: "cardapio", href: "cardápio.html" }, // sem acento possível
        { key: "cardapio", href: "cardapio.html" }, // redundância segura
        { key: "cardapio", href: "cardápio.html" },
        { key: "cardapio", href: "cardápio.html" },
        { key: "promo", href: "Promoções.html" },     // cobre "Promoções" / "Promo"
        { key: "promoções", href: "promocoes.html" },
        { key: "fidelidade", href: "fidelidade.html" },
        { key: "contato", href: "contato.html" }
    ];

    // função que tenta encontrar o href a partir do texto do item do menu
    function findHrefFromText(text) {
        if (!text) return null;
        const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
            .toLowerCase();
        for (const map of PAGE_MAP) {
            const key = map.key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            if (t.includes(key)) return map.href;
        }
        return null;
    }

    // attach: adiciona delegação no nav (se existir)
    function attachNavDelegation() {
        const nav = document.querySelector(".cabecalho");
        if (!nav) return false;

        // Remove listener prévio se houver (evita duplo attach)
        if (nav.__headerDelegationInstalled) return true;
        nav.__headerDelegationInstalled = true;

        nav.addEventListener("click", function (ev) {
            // procura elemento clicado relevante: p, a, li, button, span
            const el = ev.target.closest("p, a, li, button, span");
            if (!el || !nav.contains(el)) return;

            // extrai texto
            const txt = (el.dataset.navText || el.textContent || "").trim();
            const href = findHrefFromText(txt);

            if (href) {
                // navega
                window.location.href = href;
            } else {
                // se não encontrou, tenta ler data-href direto (caso tenha sido configurado no HTML)
                const dataHref = el.getAttribute("data-href") || el.dataset.href;
                if (dataHref) window.location.href = dataHref;
                // senao não faz nada
            }
        });

        return true;
    }

    // observer: observa inserção do nav caso ele venha depois (por injeção)
    function ensureNavAttached(timeoutMs = 5000) {
        if (attachNavDelegation()) return; // já presente

        const observer = new MutationObserver((mutations, obs) => {
            if (attachNavDelegation()) {
                obs.disconnect();
            }
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });

        // safety timeout: desconecta após X ms
        setTimeout(() => observer.disconnect(), timeoutMs);
    }

    // ENTRYPOINT após DOM ready
    document.addEventListener("DOMContentLoaded", () => {
        ensureNavAttached(7000); // espera até 7s por injeções dinâmicas
    });

    // Caso seu HTML seja SPA-like e as páginas mudem via pushState, observe mudanças de URL
    // (opcional, mas útil se você usar navegação com history API)
    let lastLocation = location.href;
    setInterval(() => {
        if (location.href !== lastLocation) {
            lastLocation = location.href;
            // re-attach se necessário (por segurança)
            ensureNavAttached(2000);
        }
    }, 500);

})();

const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const menuLateral = document.getElementById("menuLateral");

function fecharMenu() {
  menuLateral.classList.remove("ativo");
  openMenu.style.display = "block";
  closeMenu.style.display = "none";
  document.body.style.overflow = "";
}

openMenu.addEventListener("click", () => {
  menuLateral.classList.add("ativo");
  openMenu.style.display = "none";
  closeMenu.style.display = "block";
  document.body.style.overflow = "hidden";
});

closeMenu.addEventListener("click", fecharMenu);

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    fecharMenu();
  }
});
