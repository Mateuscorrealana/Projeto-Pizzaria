function setupToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener('click', () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        toggle.src = isPassword
            ? "assets-login/olho-aberto.svg"
            : "assets-login/olho-fechado.svg";
    });
}

setupToggle("senha1", "toggleSenha1");
setupToggle("senha2", "toggleSenha2");



const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
    let value = cpfInput.value.replace(/\D/g, ""); // remove tudo que não é número

    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpfInput.value = value;
});

document.querySelectorAll("img").forEach(img => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
});

document.addEventListener("dragstart", (e) => {
    e.preventDefault();
});