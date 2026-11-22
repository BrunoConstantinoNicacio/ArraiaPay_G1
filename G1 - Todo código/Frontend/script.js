const API_URL = 'http://localhost:3000/cartoes';

// 1. Abre o formulário direto, sem depender do banco por enquanto
function abrirFormulario() {
    // Gera um código temporário para você testar a tela
    document.getElementById("inputCodigoQR").value = "CARTAO-003";
    document.getElementById("inputParticipante").value = "";
    document.getElementById("inputSaldo").value = "0.00";
    
    // Abre o painel na hora
    document.getElementById("painelCadastro").style.display = "block";
}

// 2. Salva o cartão enviando os dados para a API salvar no MySQL
async function salvarCartao() {
    const codigo_qr = document.getElementById("inputCodigoQR").value;
    const nome_participante = document.getElementById("inputParticipante").value || "Não informado";
    const saldo_atual = parseFloat(document.getElementById("inputSaldo").value) || 0.00;

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo_qr, nome_participante, saldo_atual })
        });

        if (resposta.ok) {
            fecharFormulario();
            renderizarTabela(); // Recarrega a tabela puxando os dados atualizados do banco
        } else {
            alert("Erro ao salvar o cartão no banco de dados.");
        }
    } catch (erro) {
        console.error("Erro na requisição de salvamento:", erro);
    }
}

// 3. Busca os dados do banco e desenha a tabela com as miniaturas de QR Code
async function renderizarTabela() {
    try {
        const resposta = await fetch(API_URL);
        const cartoes = await resposta.json();

        const tbody = document.getElementById("tabelaCorpo");
        tbody.innerHTML = "";

        cartoes.forEach(cartao => {
            const badgeClass = cartao.status === "ativo" ? "badge-ativo" : "badge-bloqueado";
            const textoBtn = cartao.status === "ativo" ? "Bloquear" : "Desbloquear";
            const idDivMiniQR = `mini-qr-${cartao.id_cartao}`;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cartao.id_cartao}</td>
                <td>
                    <div id="${idDivMiniQR}" class="mini-qr" title="Clique para ampliar" onclick="abrirModalQR('${cartao.codigo_qr}', '${cartao.nome_participante}')"></div>
                </td>
                <td>${cartao.nome_participante}</td>
                <td><span class="${badgeClass}">${cartao.status}</span></td>
                <td>R$ ${Number(cartao.saldo_atual).toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="btn-acao btn-bloq" onclick="alternarStatus(${cartao.id_cartao})">${textoBtn}</button>
                    <button class="btn-acao btn-editar">Editar</button>
                </td>
            `;
            tbody.appendChild(tr);

            // Desenha a miniatura do QR Code na linha
            new QRCode(document.getElementById(idDivMiniQR), {
                text: cartao.codigo_qr,
                width: 42,
                height: 42,
                correctLevel: QRCode.CorrectLevel.L
            });
        });
    } catch (erro) {
        console.error("Erro ao carregar tabela do banco:", erro);
    }
}

// 4. Abre o modal com o QR Code ampliado
function abrirModalQR(codigo, nome) {
    document.getElementById("qrCodigoTexto").innerText = codigo;
    document.getElementById("qrParticipante").innerText = "Participante: " + nome;
    
    const containerGrande = document.getElementById("qrCodeGrande");
    containerGrande.innerHTML = ""; 

    new QRCode(containerGrande, {
        text: codigo,
        width: 180,
        height: 180
    });

    document.getElementById("modalQR").style.display = "flex";
}

function fecharModalQR() {
    document.getElementById("modalQR").style.display = "none";
}

function alternarStatus(id) {
    // Aqui depois a Dupla B pode implementar o PUT/UPDATE de status no banco
    alert("Função de alterar status do cartão ID: " + id);
}

// Carrega a tabela assim que a página abre
renderizarTabela();