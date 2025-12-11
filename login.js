const senhaInput = document.getElementById('senha');
const toggleSenha = document.getElementById('toggleSenha');

toggleSenha.addEventListener('click', () => {
    const isPassword = senhaInput.type === "password";

    senhaInput.type = isPassword ? "text" : "password";

    // troca o ícone
    toggleSenha.src = isPassword
        ? "assets-login/olho-aberto.svg"
        : "assets-login/olho-fechado.svg";
});
