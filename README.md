# Meu Financeiro

Sistema financeiro familiar em Next.js + Supabase, pronto para Vercel.

## Recursos
- Contas e saldos consolidados
- Receitas e despesas com categorias, pessoas, observações e filtros
- Lançamentos únicos, fixos/recorrentes e parcelados
- Vários cartões, limite, fechamento, vencimento e previsão de parcelas/faturas
- Categorias e subcategorias
- Orçamento mensal previsto × realizado
- Contas a pagar/receber e atrasos
- Fluxo de caixa futuro
- Patrimônio, dívidas e patrimônio líquido
- Metas financeiras
- Relatórios e gráficos
- Pesquisa e filtros
- Importação/exportação CSV
- Login por e-mail/senha e isolamento de dados com RLS
- Exportação CSV para cópia local; backups automáticos do banco dependem do plano/configuração do Supabase

## Instalação local
1. Crie um projeto no Supabase.
2. No SQL Editor, execute `supabase/schema.sql`.
3. Copie `.env.example` para `.env.local` e preencha URL e Publishable Key do Supabase.
4. Rode `npm install`.
5. Rode `npm run dev` e abra http://localhost:3000.

## Deploy Vercel
1. Envie este projeto para um repositório GitHub.
2. Na Vercel: Add New > Project > importe o repositório.
3. Em Environment Variables, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Faça o deploy.
5. No Supabase Auth > URL Configuration, configure a URL pública da Vercel como Site URL e inclua a URL em Redirect URLs se usar confirmação por e-mail.

Nunca publique chaves secret/service_role no navegador. O app usa apenas a Publishable Key com RLS.


## Observações de segurança
- A `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pode ser usada pelo cliente; a proteção real dos registros é feita pelas políticas RLS do banco.
- Não coloque `service_role`, senha do banco ou outra chave secreta em variável `NEXT_PUBLIC_*`.
- Para uso exclusivo do seu sogro, desative novos cadastros em Supabase > Authentication após criar a conta dele, se desejar.
- Biometria não está implementada neste MVP. Em celular, o login pode se beneficiar do gerenciador de senhas/biometria do próprio sistema; Passkeys podem ser adicionadas numa segunda etapa.

## Evoluções recomendadas
- Importação OFX e leitura de faturas bancárias
- Edição de lançamentos e conciliação bancária
- Regras automáticas de categorização por estabelecimento
- Notificações de vencimento
- Multiusuário familiar com permissões
- Passkeys/2FA
