# Como o portal funciona (visão completa)

> Visão-alvo: todos os features implementados, incluindo o mint on-chain e a autenticação SIWE.
> O demo atual implementa só o fluxo de claim, com receipt em memória. O resto é arquitetura-alvo.

## Atores

- **Usuário** — abre o dApp com uma carteira injetada (MetaMask).
- **dApp (`apps/web`)** — React + wagmi. Lista eventos e dispara o claim.
- **API (`apps/api`)** — NestJS em Bun. Valida o claim e grava o receipt.
- **Supabase** — Postgres com RLS. Guarda eventos e receipts.
- **Bundler (Pimlico)** — envia o UserOperation à Entry Point (ERC-4337).
- **Paymaster (Pimlico)** — paga o gas. Gasless para o usuário.
- **Badge.sol** — ERC-721 soulbound. Faz o mint do POAP.

## Fluxo

```
  USUÁRIO (wallet)
     │  1. connect (wagmi injected)
     ▼
  dApp (apps/web · React + wagmi)
     │  2. SIWE sign  →  API (apps/api)  →  Supabase (RLS, JWT com claim event_id)
     │  3. GET /events
     │  4. "Claim POAP" → monta UserOperation (ERC-4337): claim(eventId, merkleProof)
     ▼
  Bundler (Pimlico)
     │  5. submit UserOp
     ▼
  Entry Point (ERC-4337)
     │  6. Paymaster (Pimlico) paga o gas → gasless
     ▼
  Badge.sol (ERC-721 soulbound)
     │  7. verifica Merkle allowlist
     │  8. mint POAP → carteira do usuário
     ▼
  event Claimed(eventId, attendee, txHash)
     │  9. API grava receipt { txHash } em Supabase (só após UserOp sucesso)
     ▼
  Features on-chain / off-chain:
    • Organizer dashboard  (claim count por evento, via Supabase)
    • Raffle               (sorteio entre holders do POAP)
    • Vote                 (votação de múltipla escolha entre holders)
    • Attendance portfolio (POAPs da carteira, lidos on-chain)
```

## Passo a passo

1. **Connect** — o usuário conecta a carteira (wagmi `injected`).
2. **SIWE** — o usuário assina uma mensagem. A API valida a assinatura e emite um JWT Supabase com o claim `event_id`.
3. **Browse** — o dApp lista os eventos da API (`GET /events`).
4. **Claim** — o usuário clica "Claim POAP". O dApp monta um UserOperation (ERC-4337) que chama `Badge.claim(eventId, merkleProof)`.
5. **Gasless** — o Paymaster paga o gas. O Bundler envia o UserOp à Entry Point.
6. **On-chain** — o contrato verifica o Merkle allowlist e faz o mint de um POAP soulbound para o usuário.
7. **Receipt** — o evento `Claimed(eventId, attendee, txHash)` dispara. A API grava o receipt `{ txHash }` no Supabase, só após o UserOp ter sucesso.
8. **Portfolio** — a carteira do usuário agora tem o POAP on-chain. Os features de portfólio leem esse histórico.

## O que cada feature usa

- **Organizer dashboard** — lê os receipts do Supabase (claim count por evento).
- **Raffle** — sorteia entre os holders de um POAP (lê on-chain).
- **Vote** — envia uma votação de múltipla escolha aos holders de um POAP.
- **Attendance portfolio** — lista os POAPs de uma carteira (lê on-chain).

## Notas

- O POAP é soulbound: não transfere. Ele prova comparecimento.
- RLS no Supabase: o usuário lê só os seus receipts; o organizador lê os do seu evento.
- O Paymaster define o budget de gas por evento.

## Workflow do Claude (como o portal foi construído)

O portal é o artefato de um SDLC agentic com Claude Code: skills, subagents, hooks e MCP servers orquestram o build. O commit history mostra o passo a passo.

### Peças

- **Skills** — `claim-portal` (arquitetura do claim), `ponytail` (YAGNI ladder), `react-best-practices` / `nestjs-best-practices` / `supabase-postgres-best-practices` (vendored), `decompose` (quebra a tarefa em agentes), `handoff` (continuidade de sessão), `agent-browser` (Playwright UI check).
- **Subagents + model routing** — `scout` e `context-builder` (haiku, leitura), `coder`, `worker`, `reviewer`, `qa`, `researcher` (sonnet, escrita), `planner` e `oracle` (opus, julgamento).
- **Hooks** — `PreToolUse` bloqueia comandos destrutivos e writes em paths protegidos; `PostToolUse` roda prettier no edit; `Stop` exige o green gate.
- **MCP servers** — GitHub (PRs/issues), Supabase (DB/auth), Context7 (docs ao vivo), Playwright (browser), Serena (navegação semântica), Jira (tickets).
- **Rules** — `.claude/rules/`: `docs-honesty` (não descrever o não-implementado como presente), `code-style`, `security`, `testing`, `vendored-skills`.
- **Workflows** — `.claude/workflows/`: playbooks de `feature`, `review-fix`, `investigate`, `research`, `plan`, `orchestrate`.

### Power commands

- **`/loop [interval] [prompt]`** — roda um prompt num intervalo. Útil para polling de deploy ou monitorar PRs. Ex.: `/loop 5m "check if deploy finished"`.
- **`/simplify [focus]`** — revisa arquivos alterados por reuse, qualidade e eficiência. Spawna três review agents em paralelo, agrega os findings e aplica os fixes. Roda após cada feature.
- **`/batch [instruction]`** — orquestra mudanças grandes em paralelo. Decompõe em 5-30 unidades, spawna um agent por unidade num worktree isolado e cria PRs. Ex.: `/batch "migrate src/ from Solid to React"`.
- **`/code-review`** — analisa commits locais à frente do upstream e mudanças não commitadas na working tree.

### Review de PRs abertos

Um segundo par de olhos pega bugs antes do `main`. Ler o diff à mão é lento. Quando um teammate abre um PR — ou você quer um sanity check do seu — deixe o Claude revisar.

Pré-requisitos: Git e GitHub CLI (`gh`) configurados.

```
  PR aberto (teammate ou próprio)
     │
     │  /review <PR_NUMBER>   (Git + gh CLI)
     ▼
  Claude puxa o PR (diff + contexto)
     │
     ▼
  Review estruturada:
    • bugs
    • mudanças arriscadas
    • o que fixar
     │
     ▼
  Decisão: aprovar, pedir mudança ou aplicar fixes
```

Ex.: `/review 1234`. O Claude entrega a review como um reviewer cuidadoso.

### Loop review→fix

```
  Tarefa
     │
     ▼
  scout (haiku) ── recon ──▶ contexto comprimido
     │
     ▼
  planner (opus) ── plano ──▶ passos + riscos
     │
     ▼
  coder (sonnet) ── implementa ──▶ diff
     │
     ▼
  reviewer (sonnet/opus) ── review ──▶ findings (BLOCKER/MAJOR/MINOR/INFO)
     │
     ▼
  coder (sonnet) ── apply-pass ──▶ findings viram spec imutável
     │
     ▼
  green gate (Stop hook): lint + typecheck + typecheck:hooks + test + build
     │
     ▼
  commit (Conventional Commits, single-line)
```

### Green gate

O Stop hook bloqueia "done" até passar: `lint` (0 erros), `typecheck`, `typecheck:hooks`, `test`, `build`. Mudança que afeta runtime leva um boot-smoke da API: `GET /events`, `POST /claims`, `GET /events/1abc` → 404.

### Honestidade

A rule `docs-honesty` obriga: nunca descrever behavior não-implementado no presente. A arquitetura-alvo (SIWE, gasless mint, dashboard) fica sob "Documented target architecture (out of scope)". O demo atual implementa só o fluxo de claim.

### Fluxo Jira: ticket → PR

O fluxo completo de desenvolvimento, do ticket ao PR. Usa os agentes com model routing.

1. **Requirement** — o skill `jira-decompose` lê o ticket via Jira MCP e puxa o requirement.
2. **Plano** — o `planner` (opus) + skill `decompose` quebra o ticket em passos. Propõe um breakdown ou ação direta.
3. **Second opinion** — o `oracle` (opus) valida o plano. Só se for arriscado ou complexo.
4. **Implementa** — `coder` (lógica) e/ou `worker` (scaffold, config, docs) executam os passos e preparam tudo.
5. **Loop review→fix** — o `reviewer` enumera findings (BLOCKER/MAJOR/MINOR/INFO). O `coder` faz o apply-pass: findings viram spec imutável, aplica verbatim, sem re-rankear nem pular. Re-verify do green gate. Repete até o reviewer limpar.
6. **Entrega** — commit (Conventional Commits, single-line) e abre o PR.

```
  Jira ticket
     │  jira-decompose (skill) + Jira MCP → requirement
     ▼
  planner (opus) + decompose → plano (breakdown ou ação direta)
     │
     ▼
  oracle (opus) → second opinion  (se arriscado ou complexo)
     │
     ▼
  alinhado → coder (lógica) e/ou worker (scaffold / config / docs)
     │
     ▼
  loop review→fix:
    reviewer ──▶ findings ──▶ coder apply-pass ──▶ green gate
       ▲                                          │
       └──────────── não limpo, repete ─────────────┘
     │ limpo
     ▼
  commit (Conventional Commits) → open PR → delivery
```

### Worktrees (trabalho em paralelo)

Worktrees permitem trabalho em paralelo. Cada `coder` ou `worker` roda num git worktree separado. Eles não se chocam. Um writer por worktree.

O `.worktreeinclude` copia arquivos gitignored (ex.: `apps/api/.env`) para cada worktree novo. Assim cada worktree consegue rodar a API sem as suas próprias chaves.

O `/batch` usa isso: decompõe em 5-30 unidades, spawna um agent por unidade num worktree isolado, e cria um PR por unidade.

```
  Plano com N unidades independentes
     │
     ├─▶ worktree A → coder   → diff A → PR A
     ├─▶ worktree B → coder   → diff B → PR B
     └─▶ worktree C → worker  → diff C → PR C
```

Só paralelize quando as tarefas são de fato independentes. Fan-out multiplica tokens.
