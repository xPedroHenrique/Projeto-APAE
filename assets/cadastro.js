document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");
    const mensagem = document.getElementById("mensagem");

    form.addEventListener("submit", async(e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const resposta = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                mensagem.textContent = "Usuário criado com sucesso!";
                mensagem.style.color = "green";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } else {
                mensagem.textContent = resultado.erro;
                mensagem.style.color = "red";
            }

        } catch (error) {
            mensagem.textContent = "Erro ao conectar com o servidor.";
            mensagem.style.color = "red";
        }
    });
});