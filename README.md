Frontend de Monitoramento de Sensores IoT

Este projeto é o frontend do sistema de Monitoramento de Sensores IoT, desenvolvido com React e Vite. Ele fornece um painel em tempo real para visualizar dados de sensores, como temperatura, ocupação e iluminação em vários ambientes.
Funcionalidades

    Visualização de dados em tempo real utilizando Chart.js.
    Controles interativos para o estado das salas (luz, ar-condicionado, ocupação).
    Design responsivo para exibição de múltiplos ambientes.
    Integração com a API do backend para obtenção de dados dos sensores.

Tecnologias Utilizadas

    React: Framework para desenvolvimento do frontend.
    Vite: Ferramenta de construção para desenvolvimento rápido.
    Chart.js: Biblioteca de gráficos para visualização de dados.
    CSS/Styled Components: Para estilização.

Instalação

    Clone o repositório:

git clone https://github.com/gabsakura/Front-end.git

Acesse o diretório do projeto:

cd Front-end

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

    npm run dev

Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

VITE_BACKEND_URL=http://localhost:3000

Substitua http://localhost:3000 pelo URL da sua API backend, se necessário.
npm install
