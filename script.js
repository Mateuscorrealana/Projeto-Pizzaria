
document.addEventListener("DOMContentLoaded", () => {

/* ===========================
   CONFIGURAÇÕES
   =========================== */
const homePage = 'inicio.html';
const MAX_PIZZAS = 4;

/* ===========================
   ELEMENTOS DO HEADER
   =========================== */
const logo = document.querySelector('.logo');
const carrinhoWrapper = document.querySelector(".carrinho");
const botaoCarrinhoImg = carrinhoWrapper?.querySelector("img");

/* Badge do carrinho */
let contadorBadge = document.querySelector(".contador-carrinho");
if (!contadorBadge && carrinhoWrapper) {
    contadorBadge = document.createElement("span");
    contadorBadge.className = "contador-carrinho";
    contadorBadge.innerText = "0";
    carrinhoWrapper.appendChild(contadorBadge);
}

/* Clique na logo → voltar para home */
if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = homePage;
    });
}

/* ===========================
   CARRINHO — CAPTURA DE ELEMENTOS
   =========================== */
function getCarrinhoElements() {
    return {
        carrinhoLateral: document.getElementById("carrinhoLateral"),
        fecharCarrinhoBtn: document.getElementById("fecharCarrinho"),
        blurFundo: document.getElementById("blurFundo"),
        itensCarrinhoEl: document.getElementById("itensCarrinho"),
        totalCarrinhoEl: document.getElementById("totalCarrinho"),
        iconeVazio: document.getElementById("iconeVazio"),
        alertaMax: document.getElementById("alertaMax"),
        fecharAlertaBtn: document.getElementById("fecharAlerta")
    };
}

/* ===========================
   LOCALSTORAGE
   =========================== */
let carrinho = [];
try {
    carrinho = JSON.parse(localStorage.getItem("carrinhoPizzaria")) || [];
} catch {
    carrinho = [];
}

function salvarCarrinho() {
    localStorage.setItem("carrinhoPizzaria", JSON.stringify(carrinho));
}

/* ===========================
   ABRIR / FECHAR CARRINHO
   =========================== */
function abrirCarrinho() {
    const { carrinhoLateral, blurFundo } = getCarrinhoElements();
    if (!carrinhoLateral) return;
    carrinhoLateral.classList.add("ativo");
    blurFundo?.classList.add("ativo");
}

function fecharCarrinho() {
    const { carrinhoLateral, blurFundo } = getCarrinhoElements();
    if (!carrinhoLateral) return;
    carrinhoLateral.classList.remove("ativo");
    blurFundo?.classList.remove("ativo");
}

botaoCarrinhoImg?.addEventListener("click", abrirCarrinho);
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharCarrinho());

/* ===========================
   ALERTA DE LIMITE
   =========================== */
function mostrarAlertaMax() {
    const { alertaMax } = getCarrinhoElements();
    alertaMax.style.display = "block";
    alertaMax.setAttribute("aria-hidden", "false");
}

function fecharAlertaMax() {
    const { alertaMax } = getCarrinhoElements();
    alertaMax.style.display = "none";
    alertaMax.setAttribute("aria-hidden", "true");
}

/* ===========================
   ATUALIZAR UI DO CARRINHO
   =========================== */
function atualizarCarrinhoUI() {
    const {
        itensCarrinhoEl,
        totalCarrinhoEl,
        iconeVazio,
        fecharCarrinhoBtn,
        blurFundo,
        fecharAlertaBtn
    } = getCarrinhoElements();

    /* Atualiza badge */
    const totalItems = carrinho.reduce((s, i) => s + i.qty, 0);
    contadorBadge.innerText = totalItems;

    if (!itensCarrinhoEl) return;

    fecharCarrinhoBtn && (fecharCarrinhoBtn.onclick = fecharCarrinho);
    blurFundo && (blurFundo.onclick = fecharCarrinho);
    fecharAlertaBtn && (fecharAlertaBtn.onclick = fecharAlertaMax);

    itensCarrinhoEl.innerHTML = "";

    if (totalItems === 0) {
        iconeVazio.style.display = "flex";
        totalCarrinhoEl.innerText = "0,00";
        return;
    }

    iconeVazio.style.display = "none";

    carrinho.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item-carrinho";
        div.innerHTML = `
            <img src="${item.imagem}" class="img-item">
            <div class="info-item">
                <p>${item.nome}</p>
                <span>R$ ${item.preco.toFixed(2)}</span>
            </div>

            <div class="qty-controls" data-index="${index}">
                <button class="btn-decrease"><img src="carrinho/minus.svg"></button>
                <div class="qty">${item.qty}</div>
                <button class="btn-increase"><img src="carrinho/plus.svg"></button>
            </div>

            <button class="btn-remove" data-index="${index}">
                <img src="carrinho/trash-2 2.svg">
            </button>
        `;
        itensCarrinhoEl.appendChild(div);
    });

    const total = carrinho.reduce((s, it) => s + it.preco * it.qty, 0);
    totalCarrinhoEl.innerText = total.toFixed(2);

    /* Aumentar */
    itensCarrinhoEl.querySelectorAll(".btn-increase").forEach(btn => {
        btn.onclick = () => {
            const idx = Number(btn.closest(".qty-controls").dataset.index);
            const total = carrinho.reduce((s, it) => s + it.qty, 0);

            if (total >= MAX_PIZZAS) return mostrarAlertaMax();

            carrinho[idx].qty++;
            salvarCarrinho();
            atualizarCarrinhoUI();
        };
    });

    /* Diminuir */
    itensCarrinhoEl.querySelectorAll(".btn-decrease").forEach(btn => {
        btn.onclick = () => {
            const idx = Number(btn.closest(".qty-controls").dataset.index);

            if (carrinho[idx].qty === 1) {
                carrinho.splice(idx, 1);
            } else {
                carrinho[idx].qty--;
            }

            salvarCarrinho();
            atualizarCarrinhoUI();
        };
    });

    /* Remover */
    itensCarrinhoEl.querySelectorAll(".btn-remove").forEach(btn => {
        btn.onclick = () => {
            const idx = Number(btn.dataset.index);
            carrinho.splice(idx, 1);
            salvarCarrinho();
            atualizarCarrinhoUI();
        };
    });
}

atualizarCarrinhoUI();

/* ===========================
   ADICIONAR ITEM AO CARRINHO
   =========================== */
document.querySelectorAll(".card").forEach((card) => {
    const btn = card.querySelector(".btn-add");
    if (!btn) return;

    btn.onclick = () => {
        const nome = card.querySelector(".nome").innerText;
        const img = card.querySelector("img")?.src || "";
        const preco = Number(card.dataset.price) || 0;

        const total = carrinho.reduce((s, it) => s + it.qty, 0);
        if (total >= MAX_PIZZAS) return mostrarAlertaMax();

        let item = carrinho.find(i => i.nome === nome);

        if (item) item.qty++;
        else carrinho.push({ id: Date.now(), nome, imagem: img, preco, qty: 1 });

        salvarCarrinho();
        atualizarCarrinhoUI();
    };
});

});

/* ===========================
   TORNAR FUNÇÕES ACESSÍVEIS
   =========================== */
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
