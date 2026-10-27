// Insira a URL exata do Render gerada na Etapa 3
const URL_API = 'https://matriz-studio-api.onrender.com/api/pedidos';

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const container = document.getElementById('pedidos-container');
    const btnAtualizar = document.getElementById('btn-atualizar');

    function buscarPedidos() {
        fetch(URL_API)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao procurar pedidos');
                return response.json();
            })
            .then(pedidos => {
                renderizarOrdensProducao(pedidos);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                if (container) {
                    container.innerHTML = '<p class="empty-msg" style="color: red; text-align: center;">❌ Erro ao ligar à API no Render.</p>';
                }
            });
    }

    function renderizarOrdensProducao(pedidos) {
        if (!container) return;

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p class="empty-msg" style="text-align:center;">Nenhuma ordem de produção recebida.</p>';
            return;
        }

        container.innerHTML = '';

        pedidos.reverse().forEach((pedido, index) => {
            const numeroOP = String(pedidos.length - index).padStart(3, '0');
            const produtosLista = Array.isArray(pedido.produtos) ? pedido.produtos : [pedido.produto || 'Porta-Lápis Personalizado'];
            const nomeProdutoPrincipal = produtosLista[0] || 'Porta-Lápis';
            const quantPecas = pedido.quantidade || 1;

            const cardHTML = `
                <div class="op-card">
                    <button class="btn-print-op" onclick="window.print()">🖨️ Imprimir OP</button>
                    
                    <div class="op-header">
                        <img src="assets/logo.png" alt="Matriz Studio" class="op-logo" onerror="this.style.display='none'" />
                        <div class="op-title-row">
                            <div>
                                <div class="op-title">ORDEM DE PRODUÇÃO Nº ____${numeroOP}____</div>
                            </div>
                            <div class="op-meta">
                                Data: __${pedido.dataHora ? pedido.dataHora.split(' ')[0] : '__/__/____'}__<br>
                                Hora: __${pedido.dataHora ? pedido.dataHora.split(' ')[1] || '__:__' : '__:__'}__<br>
                                Operador: _______________
                            </div>
                            <div class="op-company">Matriz Studio</div>
                        </div>
                    </div>

                    <div class="op-grid-fields">
                        <div class="field-group">
                            <label>PRODUTO:</label>
                            <span>${nomeProdutoPrincipal}</span>
                        </div>
                        <div class="field-group">
                            <label>QUANT:</label>
                            <span>__${quantPecas}__ peças</span>
                        </div>
                        <div class="field-group">
                            <label>CÓDIGO:</label>
                            <span>HL-VRD-001</span>
                        </div>
                        <div class="field-group">
                            <label>TIPO:</label>
                            <span>Porta-Lápis</span>
                        </div>
                        <div class="field-group">
                            <label>DATA INÍCIO PRODUÇÃO:</label>
                            <span class="line-field"></span>
                        </div>
                        <div class="field-group">
                            <label>DATA ENT:</label>
                            <span class="line-field"></span>
                        </div>
                        <div class="field-group">
                            <label>DATA ENTRADA PCP:</label>
                            <span class="line-field"></span>
                        </div>
                        <div class="field-group">
                            <label>DATA SAÍDA PCP:</label>
                            <span class="line-field"></span>
                        </div>
                    </div>

                    <div class="op-section-title">PROCESSOS</div>
                    <table class="op-table">
                        <thead>
                            <tr>
                                <th style="width: 25%;">PROCESSO</th>
                                <th style="width: 50%;">DESCRIÇÃO</th>
                                <th style="width: 25%;">META</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Produção</td>
                                <td>Produção do <strong>${nomeProdutoPrincipal}</strong></td>
                                <td>${quantPecas} peças</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="op-section-title">MATERIAIS</div>
                    <table class="op-table">
                        <thead>
                            <tr>
                                <th style="width: 30%;">CÓDIGO</th>
                                <th style="width: 45%;">MATERIAL</th>
                                <th style="width: 25%;">QUANTIDADE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>-</td>
                                <td>Tubete</td>
                                <td>${quantPecas * 2} Peças</td>
                            </tr>
                            <tr>
                                <td>-</td>
                                <td>Adesivo Amarelo Listrado</td>
                                <td>${nomeProdutoPrincipal.includes('Amarelo') ? 'X' : '-'}</td>
                            </tr>
                            <tr>
                                <td>-</td>
                                <td>Adesivo Azul Listrado</td>
                                <td>${nomeProdutoPrincipal.includes('Azul') ? 'X' : '-'}</td>
                            </tr>
                            <tr>
                                <td>-</td>
                                <td>Adesivo Hello Kitty</td>
                                <td>${nomeProdutoPrincipal.includes('Hello Kitty') ? 'X' : '-'}</td>
                            </tr>
                            <tr>
                                <td>-</td>
                                <td>Adesivo Homem Aranha</td>
                                <td>${nomeProdutoPrincipal.includes('Homem-Aranha') || nomeProdutoPrincipal.includes('Homem Aranha') ? 'X' : '-'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="op-section-title">Observações / ocorrências:</div>
                    <div class="obs-lines">
                        <div class="obs-text">${pedido.observacoes ? 'Obs do Cliente: ' + pedido.observacoes : ''}</div>
                        <div class="obs-line"></div>
                        <div class="obs-line"></div>
                        <div class="obs-line"></div>
                    </div>

                    <div class="op-footer-fields">
                        <div>NOME DO DESTINATÁRIO: ${pedido.cliente || '____________________'}</div>
                        <div>FEITO POR: _______________</div>
                        <div>REVISÃO: 00</div>
                    </div>
                    <div class="op-footer-fields">
                        <div>MODELO: Porta-Lápis</div>
                        <div>DESCRIÇÃO: Porta-Lápis de 02 peças</div>
                        <div>STATUS: _______________</div>
                    </div>

                    <div class="op-disclaimer">DOCUMENTO MODELO PARA ATIVIDADE ESCOLAR – SENAI</div>
                    <div class="senai-logo-container">
                        <span class="senai-badge">SENAI</span>
                    </div>
                </div>
            `;

            container.innerHTML += cardHTML;
        });
    }

    btnAtualizar?.addEventListener('click', buscarPedidos);

    buscarPedidos();
    setInterval(buscarPedidos, 5000);
});
