# Sistema de Votação - Frontend Vue.js

Este é o frontend do sistema de votação desenvolvido em Vue.js 3 com PrimeVue.

## 🚀 Funcionalidades

### Para Usuários
- **Lista de Temas**: Visualizar todos os temas disponíveis para votação
- **Detalhes do Tema**: Ver informações completas de um tema específico
- **Sistema de Votação**: Votar em temas ativos
- **Estatísticas**: Ver totais de votos e últimos votos registrados

### Para Administradores
- **Gestão de Temas**: Criar, editar, ativar e inativar temas
- **Visualização de Dados**: Ver estatísticas e detalhes de todos os temas
- **Controle de Status**: Ativar/inativar temas conforme necessário

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo
- **PrimeVue 4**: Biblioteca de componentes UI
- **PrimeFlex**: Sistema de grid e utilitários CSS
- **Axios**: Cliente HTTP para requisições à API
- **PrimeIcons**: Ícones da biblioteca PrimeVue

## 📦 Instalação

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar backend**:
Certifique-se de que o backend está rodando na porta 3000 (http://localhost:3000)

3. **Executar o projeto**:
```bash
npm run serve
```

4. **Acessar a aplicação**:
Abra http://localhost:8080 no seu navegador

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ListaTemas.vue      # Lista de temas para votação
│   ├── DetalhesTema.vue    # Detalhes de um tema específico
│   └── Administracao.vue   # Painel administrativo
├── services/
│   └── api.js             # Serviços de comunicação com backend
├── App.vue                # Componente principal
└── main.js               # Configuração da aplicação
```

## 🔧 Configuração da API

O arquivo `src/services/api.js` contém todas as chamadas para o backend:

- **Temas**: CRUD completo (criar, ler, atualizar, deletar)
- **Votos**: Registrar votos e obter estatísticas
- **Status**: Ativar/inativar temas

## 🎨 Interface

### Tema Principal
- Header com navegação entre "Temas" e "Administração"
- Design responsivo com PrimeFlex
- Tema visual moderno com PrimeVue

### Lista de Temas
- Grid responsivo de cards
- Preview de imagens
- Contadores de votos
- Botões de ação (ver detalhes, votar)

### Detalhes do Tema
- Imagem em tamanho grande
- Informações completas
- Estatísticas de votos
- Lista dos últimos votos

### Administração
- Tabela com todos os temas
- Paginação e ordenação
- Formulários para criar/editar
- Controles de ativação/inativação

## 🔌 Integração com Backend

O frontend se comunica com as seguintes rotas do backend:

### Temas
- `GET /tema` - Listar todos os temas
- `GET /tema/:id` - Obter tema específico
- `POST /tema` - Criar novo tema
- `PUT /tema/:id` - Atualizar tema
- `PATCH /tema/:id/inativar` - Inativar tema
- `PATCH /tema/:id/ativar` - Ativar tema

### Votos
- `GET /votos/:idTema` - Listar votos de um tema
- `POST /votar/:idTema` - Registrar voto
- `GET /votos/total/:idTema` - Obter total de votos

## 🚀 Deploy

Para fazer o build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web.

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎯 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar gráficos de estatísticas
- [ ] Implementar notificações em tempo real
- [ ] Adicionar filtros avançados
- [ ] Implementar exportação de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
