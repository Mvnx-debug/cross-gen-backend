# Módulo de Autenticação

## 📁 Estrutura do Módulo

```
src/modules/auth/
├── auth.types.ts          # Interfaces e tipos TypeScript
├── auth.repository.ts     # Acesso ao banco de dados (Drizzle ORM)
├── auth.service.ts        # Regras de negócio
├── auth.controller.ts     # Lógica de HTTP (request/response)
├── auth.validators.ts     # Schemas de validação (Elysia)
└── auth.routes.ts         # Definição de rotas
```

## 🏗️ Arquitetura em Camadas

### 1. **Types** (`auth.types.ts`)
Define contratos e interfaces usadas em todo o módulo.

**Interfaces principais:**
- `CreateOwnerDTO` - Dados para criar o primeiro Owner
- `SetupResponse` - Resposta do endpoint de setup
- `AuthUser` - Usuário autenticado
- `LoginDTO` - Dados de login
- `LoginResponse` - Resposta do login

### 2. **Repository** (`auth.repository.ts`)
Responsável por todas as operações de banco de dados.

**Métodos principais:**
- `findUserByEmail(email)` - Buscar usuário por email
- `findUserByAuthId(authUserId)` - Buscar usuário por ID do Better Auth
- `findFirstOwner()` - Verificar se já existe um Owner
- `createBox(name)` - Criar um novo Box
- `createDomainUser(data)` - Criar usuário na tabela `users`
- `deleteBox(boxId)` - Deletar Box (rollback)
- `deleteAuthUser(authUserId)` - Deletar usuário auth (rollback)

### 3. **Service** (`auth.service.ts`)
Contém toda a lógica de negócio e orquestração.

**Métodos principais:**
- `createOwnerWithBox(data)` - Criar Owner + Box (transação com rollback)
- `isFirstSetup()` - Verificar se é a primeira configuração
- `getUserByAuthId(authUserId)` - Buscar usuário completo
- `validateCredentials(data)` - Validar login

**Lógica de Transação:**
1. Verifica email duplicado
2. Cria Box
3. Cria usuário no Better Auth
4. Cria usuário no domínio
5. Em caso de erro, executa rollback

### 4. **Controller** (`auth.controller.ts`)
Gerencia a lógica de request/response HTTP.

**Métodos principais:**
- `setup(data)` - Endpoint `/auth/setup`
- `needSetup()` - Endpoint `/auth/need-setup`
- `login(data)` - Endpoint `/auth/login`

**Retorno padrão:**
```typescript
{
  status: number,  // HTTP status code
  data: any        // Dados ou erro
}
```

### 5. **Validators** (`auth.validators.ts`)
Define schemas de validação usando Elysia.

**Schemas:**
- `setupSchema` - Validação para setup (email, password, name, boxName)
- `loginSchema` - Validação para login (email, password)

### 6. **Routes** (`auth.routes.ts`)
Define as rotas HTTP e conecta com o controller.

**Endpoints:**
- `POST /auth/setup` - Criar primeiro Owner + Box
- `GET /auth/need-setup` - Verificar se precisa fazer setup
- `POST /auth/login` - Fazer login

## 🔄 Fluxo de uma Requisição

```
Request → Routes → Controller → Service → Repository → Database
                                    ↓
Response ← Routes ← Controller ← Service ← Repository ← Database
```

## 📊 Exemplo de Uso

### Criar Owner com Box

**Request:**
```http
POST /api/auth/setup
Content-Type: application/json

{
  "email": "owner@box.com",
  "password": "senha123",
  "name": "João Silva",
  "boxName": "CrossFit Champion"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "owner@box.com",
    "role": "OWNER"
  },
  "box": {
    "id": "uuid",
    "name": "CrossFit Champion"
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**
```json
{
  "error": "Email já cadastrado"
}
```

## ✅ Vantagens dessa Arquitetura

1. **Separação de Responsabilidades (SRP)** - Cada arquivo tem um propósito específico
2. **Testabilidade** - Cada camada pode ser testada independentemente
3. **Reutilização** - Repository e Service podem ser usados em diferentes contextos
4. **Manutenção** - Mudanças em uma camada não afetam as outras
5. **Escalabilidade** - Fácil adicionar novas funcionalidades
6. **Type-Safety** - TypeScript forte em todas as camadas

## 🧪 Testes

Para testar o módulo:

```bash
# Executar testes
bun test src/modules/auth

# Executar apenas um arquivo de teste
bun test src/modules/auth/auth.service.test.ts
```

## 🔐 Segurança

- Senhas são hasheadas pelo Better Auth
- Tokens JWT para autenticação
- Validação de entrada em todas as rotas
- Rollback automático em caso de falha

## 📝 Próximos Passos

- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração
- [ ] Implementar refresh token
- [ ] Adicionar rate limiting
- [ ] Implementar 2FA (autenticação de dois fatores)
