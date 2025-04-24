document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formDoacao");
    const mensagem = document.getElementById("mensagem");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const valor = parseFloat(document.getElementById("valor").value);
        const tipo = document.getElementById("tipo").value;

        const dados = { nome, valor, tipo };

        try {
            const resposta = await fetch("http://localhost:3000/doacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                mensagem.textContent = "Doação registrada com sucesso!";
                mensagem.style.color = "green";
                form.reset();
            } else {
                mensagem.textContent = resultado.erro || "Erro ao registrar doação.";
                mensagem.style.color = "red";
            }
        } catch (error) {
            mensagem.textContent = "Erro de conexão com o servidor.";
            mensagem.style.color = "red";
            console.error(error);
        }
    });
});