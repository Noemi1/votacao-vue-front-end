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

## 🔌 Integração com Backend

### 📡 Chamadas HTTP (API REST)

O frontend utiliza o Axios para comunicação com o backend através das seguintes chamadas HTTP:

##### **Temas**
- `GET /tema`: Listar todos os temas
- `GET /tema/:id`: Obter tema específico
- `POST /tema`: Criar novo tema
- `PUT /tema/:id`: Atualizar tema
- `PATCH /tema/:id/inativar`: Inativar tema
- `PATCH /tema/:id/ativar`: Ativar tema

##### **Votos**
- `GET /votos/:idTema`: Listar votos de um tema 
- `POST /votos/:idTema`: Registrar voto
- `GET /votos/total/:idTema`: Obter total de votos de um tema

#### 🔌 Eventos WebSocket

O frontend utiliza Socket.IO para comunicação em tempo real com os seguintes eventos:

#### **Eventos Recebidos do Backend**
- `listaTemas`:  Lista inicial de temas
- `newTema`:  Novo tema criado 
- `updateTema`:  Tema atualizado 
- `temaInativado`:  Tema inativado 
- `temaAtivado`:  Tema ativado 
- `votoRegistrado`:  Novo voto registrado 

#### **Eventos Internos do Frontend**

- `temasAtualizados`: Lista de temas atualizada
- `temaCriado`: Novo tema recebido
- `temaAtualizado`: Tema modificado
- `temaInativado`: Tema desativado
- `temaAtivado`: Tema reativado
- `votoRegistrado`: Voto processado
