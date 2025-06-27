## Caso de uso: Contagem de Votos em temas 
#### 🛠️ Linguagem e bibliotecas
- **Vue.js**: Framework Front-end
- **Primevue, 
    Primeflex, 
    Primeicons,
    Tailwind:** bibliotecas de componentes e estilos
- **Websocket**: Socket.io-client
- **Axios**: Requisições HTTP

#### 📦 Manual de Instalação

1. **Instalar dependências**: ```npm install```

2. **Configurar backend**:
Certifique-se de que o backend está rodando na porta 3000 (http://localhost:3000)

3. **Executar o projeto**: ```npm run serve```

4. **Acessar a aplicação**:
Url:  http://localhost:8080 no seu navegador

#### 🚀 Deploy

```npm run build```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web.

#### Funcionalidades Principais
- Contabilização de votos em temas

#### CRUD Votos
- **Listar Temas disponíveis**: Visualizar todos os temas disponíveis para votação
- **Detalhes do Tema**: Ver informações completas de um tema específico
- **Sistema de Votação**: Votar em temas ativos
- **Estatísticas**: Ver totais de votos e últimos votos registrados

#### CRUD Temas
- **Gestão de Temas**: Criar, editar, ativar e inativar temas
- **Visualização de Dados**: Ver estatísticas e detalhes de todos os temas
- **Controle de Status**: Ativar/inativar temas conforme necessário
