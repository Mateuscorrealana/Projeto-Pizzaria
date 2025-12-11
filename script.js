document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       CONFIGURAÇÕES
    =========================== */
    const homePage = 'inicio.html';
    const MAX_PIZZAS = 4;

    /* ===========================
       TOAST - ITEM ADICIONADO
    =========================== */
    function showToast() {
        const toast = document.getElementById("toast");
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 1800);
    }

    /* ===========================
       ALERTA - ITEM REMOVIDO
    =========================== */
    function mostrarRemovido() {
        const alertaRemo = document.getElementById("item-remo");
        alertaRemo.classList.add("show");

        setTimeout(() => {
            alertaRemo.classList.remove("show");
        }, 1800);
    }

    /* ===========================
       ELEMENTOS DO HEADER
    =========================== */
    const logo = document.querySelector('.logo');
    const carrinhoWrapper = document.querySelector(".carrinho");

    let contadorBadge = document.querySelector(".contador-carrinho");
    if (!contadorBadge && carrinhoWrapper) {
        contadorBadge = document.createElement("span");
        contadorBadge.className = "contador-carrinho";
        contadorBadge.innerText = "0";
        carrinhoWrapper.appendChild(contadorBadge);
    }

    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = homePage;
        });
    }

    /* ===========================
       CARRINHO — ELEMENTOS
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
        carrinhoLateral.classList.add("ativo");
        blurFundo.classList.add("ativo");
    }

    function fecharCarrinho() {
        const { carrinhoLateral, blurFundo } = getCarrinhoElements();
        carrinhoLateral.classList.remove("ativo");
        blurFundo.classList.remove("ativo");
    }

    document.querySelector(".carrinho img")?.addEventListener("click", abrirCarrinho);
    document.addEventListener("keydown", (e) => e.key === "Escape" && fecharCarrinho());

    /* ===========================
       ALERTA 4 ITENS
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

        const totalItems = carrinho.reduce((s, i) => s + i.qty, 0);
        contadorBadge.innerText = totalItems;

        itensCarrinhoEl.innerHTML = "";

        if (totalItems === 0) {
            iconeVazio.style.display = "flex";
            totalCarrinhoEl.innerText = "0,00";
        } else {
            iconeVazio.style.display = "none";
        }

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

        totalCarrinhoEl.innerText = carrinho
            .reduce((s, it) => s + it.preco * it.qty, 0)
            .toFixed(2);

        /* ========== AUMENTAR ========== */
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

        /* ========== DIMINUIR ========== */
        itensCarrinhoEl.querySelectorAll(".btn-decrease").forEach(btn => {
            btn.onclick = () => {
                const idx = Number(btn.closest(".qty-controls").dataset.index);

                if (carrinho[idx].qty > 1) {
                    carrinho[idx].qty--;
                    mostrarRemovido();
                } else {
                    carrinho.splice(idx, 1);
                    mostrarRemovido();
                }

                salvarCarrinho();
                atualizarCarrinhoUI();
            };
        });

        /* ========== REMOVER ========== */
        itensCarrinhoEl.querySelectorAll(".btn-remove").forEach(btn => {
            btn.onclick = () => {
                const idx = Number(btn.dataset.index);
                carrinho.splice(idx, 1);

                salvarCarrinho();
                atualizarCarrinhoUI();
                mostrarRemovido();
            };
        });

        fecharCarrinhoBtn.onclick = fecharCarrinho;
        blurFundo.onclick = fecharCarrinho;
        fecharAlertaBtn.onclick = fecharAlertaMax;
    }

    atualizarCarrinhoUI();

    /* ===========================
       ADICIONAR ITEM COM ANIMAÇÃO
    =========================== */
    document.querySelectorAll(".card").forEach((card) => {
        const btn = card.querySelector(".btn-add");

        btn.onclick = () => {
            const nome = card.querySelector(".nome").innerText;
            const img = card.querySelector("img")?.src || "";
            const preco = Number(card.dataset.price);

            const total = carrinho.reduce((s, it) => s + it.qty, 0);
            if (total >= MAX_PIZZAS) return mostrarAlertaMax();

            let item = carrinho.find(i => i.nome === nome);
            if (item) item.qty++;
            else carrinho.push({ id: Date.now(), nome, imagem: img, preco, qty: 1 });

            salvarCarrinho();
            atualizarCarrinhoUI();
            showToast();

            // ===== ANIMAÇÃO VOANDO PARA O CARRINHO =====
            const cartIcon = document.querySelector(".carrinho img");
            const pizzaImg = card.querySelector("img");

            const flyingImg = pizzaImg.cloneNode(true);
            flyingImg.classList.add("flying-img");
            document.body.appendChild(flyingImg);

            const rect = pizzaImg.getBoundingClientRect();
            flyingImg.style.left = rect.left + "px";
            flyingImg.style.top = rect.top + "px";

            // força o reflow
            flyingImg.getBoundingClientRect();

            const cartRect = cartIcon.getBoundingClientRect();
            flyingImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`;
            flyingImg.style.opacity = "0.5";

            flyingImg.addEventListener("transitionend", () => {
                flyingImg.remove();
            });
        };
    });

    /* ===========================
       BLOQUEAR ARRASTAR IMAGENS
    =========================== */
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    document.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });

});

const loginIcon = document.getElementById('login-icon');
loginIcon.addEventListener('click', () => {
    window.location.href = 'login.html';
});


const menuItems = document.querySelectorAll('.cabecalho p');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove a classe de todos
        menuItems.forEach(i => i.classList.remove('active'));
        // Adiciona a classe no item clicado
        item.classList.add('active');
    });
});
