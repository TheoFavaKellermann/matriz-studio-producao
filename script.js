// Substitua pela sua URL exata gerada no Render
const URL_API = 'https://matriz-studio-api.onrender.com/api/pedidos';

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const container = document.getElementById('pedidos-container');
    const btnAtualizar = document.getElementById('btn-atualizar');

    // Função para carregar pedidos da API na nuvem
    function buscarPedidos() {
        fetch(URL_API)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao procurar pedidos');
                return response.json();
            })
            .then(pedidos => {
                renderizarPedidos(pedidos);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                if (container) {
                    container.innerHTML = '<p class="empty-msg" style="color: #ef4444;">❌ Erro ao ligar ao servidor do Render.</p>';
                }
            });
    }

    // Função para construir o HTML dos cartões de pedidos
    function renderizarPedidos(pedidos) {
        if (!container) return;

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p class="empty-msg">Nenhum pedido recebido até ao momento.</p>';
            return;
        }

        container.innerHTML = ''; // Limpa a mensagem de carregamento

        pedidos.reverse().forEach((pedido, index) => {
            const produtosTexto = Array.isArray(pedido.produtos) 
                ? pedido.produtos.join(', ') 
                : (pedido.produto || 'Item não especificado');

            container.innerHTML += `
                <div class="pedido-card">
                    <div class="pedido-card-header">
                        <span class="pedido-id">Pedido #${pedidos.length - index}</span>
                        <span class="pedido-data">${pedido.dataHora || 'Recentemente'}</span>
                    </div>
                    <div class="pedido-detalhes">
                        <p><span>Cliente:</span> ${pedido.cliente || 'Cliente Online'}</p>
                        <p><span>Itens:</span> ${produtosTexto}</p>
                        <p><span>Quantidade:</span> ${pedido.quantidade || 1}</p>
                        <p><span>Obs:</span> ${pedido.observacoes || 'Sem observações'}</p>
                    </div>
                </div>
            `;
        });
    }

    // Botão de atualização manual
    btnAtualizar?.addEventListener('click', () => {
        buscarPedidos();
    });

    // Procura novos pedidos automaticamente a cada 5 segundos
    buscarPedidos();
    setInterval(buscarPedidos, 5000);
});