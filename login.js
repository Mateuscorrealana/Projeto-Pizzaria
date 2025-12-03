import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDyaiQqHmT7m7FJDVM7-eSaN6qpzv7vqac",
    authDomain: "notificador-de-provas-28344.firebaseapp.com",
    projectId: "notificador-de-provas-28344",
    storageBucket: "notificador-de-provas-28344.firebasestorage.app",
    messagingSenderId: "365726662787",
    appId: "1:365726662787:web:84fcb4511877d7ad42dbb6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Alternância entre telas de login/cadastro
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".sign-in form");

    // Login com e-mail fixo
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = loginForm.querySelector("input[type='email']");
        const passwordInput = loginForm.querySelector("input[type='password']");

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "admin@email.com" && password === "1234") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("user", JSON.stringify({ name: "Admin", email }));
            window.location.href = "index.html";
        } else {
            alert("Email ou senha incorretos!");
        }
    });

    // Botão de login com Google
    const btnGoogle = document.getElementById("btnLoginGoogle");

    if (btnGoogle) {
        btnGoogle.addEventListener("click", () => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    localStorage.setItem("user", JSON.stringify({
                        name: user.displayName,
                        email: user.email,
                        photo: user.photoURL
                    }));
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    console.error("Erro ao logar com Google:", error);
                    alert("Erro ao logar com Google.");
                });
        });
    }

    // Proteção da página index.html
    if (window.location.pathname.includes("index.html")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            window.location.href = "login.html";
        } else {
            const saudacao = document.querySelector(".titulo");
            if (saudacao) {
                saudacao.textContent = `Olá, ${user.name.split(" ")[0]}!`;
            }
        }
    }
});
