# 🏋️ CrossGen Backend

API backend para gerenciamento de boxes de CrossFit, incluindo gestão de atletas, workouts (WODs), resultados e personal records (PRs).

## 🚀 Stack Tecnológica

- **Runtime:** [Bun](https://bun.sh) v1.3.5+
- **Framework:** [Elysia](https://elysiajs.com) - Web framework para Bun
- **Database:** PostgreSQL
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Authentication:** [Better Auth](https://better-auth.com)
- **Language:** TypeScript (Strict Mode)

---

## 📋 Pré-requisitos

- [Bun](https://bun.sh) v1.3.5 ou superior
- PostgreSQL 14+
- Docker (opcional, para rodar o banco)

---

## ⚙️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd cross-gen-backend
```

### 2. Instale as dependências
```bash
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crossgen"

# Better Auth
BETTER_AUTH_SECRET="seu-secret-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Server
PORT=3000
NODE_ENV=development
```

### 4. Execute as migrations
```bash
bun run db:generate  # Gerar migrations
bun run db:push      # Aplicar no banco
```

### 5. Inicie o servidor
```bash
bun run dev
```

O servidor estará rodando em `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
src/
├── app.ts                      # Configuração do Elysia
├── server.ts                   # Entry point
├── domain/                     # Tipos de domínio
│   └── user.ts
├── modules/                    # Módulos da aplicação
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   ├── health/
│   │   └── health.routes.ts
│   └── users/
│       └── users.routes.ts
└── shared/                     # Código compartilhado
    ├── auth/                   # Autenticação e guards
    ├── config/                 # Configurações
    ├── db/                     # Database e schemas
    └── types/                  # Tipos compartilhados
```

---

## 🔐 Autenticação

O sistema usa **Better Auth** com estratégia de email/password.

### Roles Disponíveis:
- `OWNER` - Dono do box (acesso total)
- `COACH` - Treinador (gerenciar WODs e atletas)
- `ATHLETE` - Atleta (visualizar e registrar resultados)

### Guards Implementados:
- `authMiddleware` - Valida sessão e busca usuário
- `requireRole(['OWNER'])` - Restringe acesso por role

---

## 🧪 Testando a API

### Setup Inicial (Criar Owner + Box)
```bash
POST http://localhost:3000/api/auth/setup
Content-Type: application/json

{
  "email": "owner@crossgen.com",
  "password": "senha123",
  "name": "Owner Test",
  "boxName": "CrossGen Box Alpha"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/sign-in/email
Content-Type: application/json
Origin: http://localhost:3000

{
  "email": "owner@crossgen.com",
  "password": "senha123"
}
```

### Obter Perfil (Requer autenticação)
```bash
GET http://localhost:3000/api/users/me
Cookie: better-auth.session_token=<seu-token>
```



## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev              # Inicia servidor em modo watch

# Database
bun run db:generate      # Gera migrations do Drizzle
bun run db:push          # Aplica migrations no banco
bun run db:studio        # Abre Drizzle Studio (GUI do banco)

# Utilitários
bun reset-password.ts    # Limpa banco para recomeçar
```

---

## 🗄️ Schema do Banco

### Tabelas Better Auth:
- `user` - Usuários básicos
- `session` - Sessões ativas
- `account` - Contas e senhas
- `verification` - Tokens de verificação

### Tabelas de Domínio:
- `users` - Usuários com role e boxId
- `boxes` - Boxes cadastrados

**Diagrama ER:** (TODO)

---



## 🐛 Debug e Troubleshooting

### Erro 401 Unauthorized
- Verifique se o cookie está sendo enviado
- Confirme que a sessão não expirou (válida por 7 dias)

### Erro 403 Forbidden
- Usuário autenticado mas sem permissão
- Verifique a role do usuário no banco

### Erro 500 Internal Server Error
- Verifique os logs do servidor
- Confirme que existe registro na tabela `users` (não só `user`)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com 💪 por Marcos

---

## 🙏

- [Bun](https://bun.sh) - Runtime 
- [Elysia](https://elysiajs.com) - Framework 
- [Drizzle ORM](https://orm.drizzle.team) - ORM TypeScript-first
- [Better Auth](https://better-auth.com) - Autenticação simplificada
