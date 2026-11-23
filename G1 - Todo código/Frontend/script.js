
const API_URL = "http://localhost:8080/api/cartoes";

// ABRIR FORMULÁRIO
function abrirFormulario() {
    document.getElementById("inputCodigoQR").value =
        "Gerado automaticamente";

    document.getElementById("inputParticipante").value = "";
    document.getElementById("inputSaldo").value = "0.00";

    document.getElementById("painelCadastro").style.display = "block";
}

// FECHAR FORMULÁRIO
function fecharFormulario() {
    document.getElementById("painelCadastro").style.display = "none";
}

// CRIAR NOVO CARTÃO

async function salvarCartao() {

    const nome = document.getElementById(
        "inputParticipante"
    ).value.trim();

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeParticipante: nome || "Não informado"
            })
        });

        if (!resposta.ok) {
            throw new Error("Erro ao criar cartão");
        }

        fecharFormulario();
        await renderizarTabela();

        alert("Cartão criado com sucesso!");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao criar cartão.");
    }
}


// LISTAR CARTÕES NA TABELA
async function renderizarTabela() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar cartões");
        }

        const cartoes = await resposta.json();
        const tbody = document.getElementById("tabelaCorpo");

        tbody.innerHTML = "";

        cartoes.forEach(cartao => {
            const ativo = cartao.status === "ATIVO";

            const tr = document.createElement("tr");

            // ID
            const tdId = tr.insertCell();
            tdId.textContent = cartao.id;

            // QR CODE
            const tdQr = tr.insertCell();

            const imagemQr = document.createElement("img");
            imagemQr.src = `${API_URL}/${cartao.id}/qrcode`;
            imagemQr.width = 42;
            imagemQr.height = 42;
            imagemQr.alt = "QR Code";
            imagemQr.style.cursor = "pointer";

            imagemQr.onclick = () => abrirModalQR(cartao);

            tdQr.appendChild(imagemQr);

            // PARTICIPANTE
            const tdNome = tr.insertCell();
            tdNome.textContent =
                cartao.nomeParticipante || "Não informado";

            // STATUS
            const tdStatus = tr.insertCell();

            const badge = document.createElement("span");
            badge.className = ativo
                ? "badge-ativo"
                : "badge-bloqueado";

            badge.textContent = cartao.status;
            tdStatus.appendChild(badge);

            // SALDO
            const tdSaldo = tr.insertCell();

            tdSaldo.textContent =
                Number(cartao.saldo ?? 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                });

            // AÇÕES
            const tdAcoes = tr.insertCell();

            const botaoStatus = document.createElement("button");

            botaoStatus.className = "btn-acao btn-bloq";
            botaoStatus.textContent = ativo
                ? "Bloquear"
                : "Desbloquear";

            botaoStatus.onclick = () =>
                alternarStatus(cartao.id);

            tdAcoes.appendChild(botaoStatus);

            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar cartões. Verifique o Java.");
    }
}

// MOSTRAR QR CODE AMPLIADO
function abrirModalQR(cartao) {
    document.getElementById("qrCodigoTexto").textContent =
        cartao.codigoQr;

    document.getElementById("qrParticipante").textContent =
        "Participante: " +
        (cartao.nomeParticipante || "Não informado");

    const container = document.getElementById("qrCodeGrande");

    container.innerHTML = "";

    const imagem = document.createElement("img");

    imagem.src = `${API_URL}/${cartao.id}/qrcode`;
    imagem.width = 180;
    imagem.height = 180;
    imagem.alt = "QR Code ampliado";

    container.appendChild(imagem);

    document.getElementById("modalQR").style.display = "flex";
}

// FECHAR QR CODE
function fecharModalQR() {
    document.getElementById("modalQR").style.display = "none";
}

// BLOQUEAR OU DESBLOQUEAR
async function alternarStatus(id) {
    try {
        const resposta = await fetch(
            `${API_URL}/${id}/status`,
            {
                method: "PUT"
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao alterar status");
        }

        await renderizarTabela();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao bloquear ou desbloquear cartão.");
    }
}

// INICIAR SISTEMA
document.addEventListener("DOMContentLoaded", () => {
    renderizarTabela();
});
