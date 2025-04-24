exports.handler = async function (event, context) {
    if (event.httpMethod === "POST") {
        const { nome, email, valor } = JSON.parse(event.body);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Doação registrada com sucesso!" }),
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método não permitido" }),
        };
    }
};
