# Deploy: Supabase + Vercel

## 1. Supabase
1. Crie um projeto em https://supabase.com/dashboard.
2. Abra **SQL Editor**, cole todo o conteúdo de `supabase/schema.sql` e execute.
3. Vá em **Project Settings / API** ou no diálogo **Connect** e copie:
   - Project URL
   - Publishable key (`sb_publishable_...`)
4. Em **Authentication > Providers > Email**, mantenha Email/Password habilitado.
5. Para facilitar o primeiro teste, você pode temporariamente desligar a confirmação de e-mail. Em produção, prefira mantê-la ligada.

## 2. Teste local
```bash
cp .env.example .env.local
# edite .env.local com URL + publishable key
npm install
npm run dev
```
Acesse `http://localhost:3000`, crie a conta do seu sogro e faça login.

## 3. GitHub
```bash
git init
git add .
git commit -m "Sistema financeiro inicial"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

## 4. Vercel
1. Na Vercel, escolha **Add New > Project** e importe o repositório.
2. Framework Preset: **Next.js**.
3. Adicione em **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL do projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = publishable key
4. Faça o deploy.
5. Copie a URL final, por exemplo `https://meu-financeiro.vercel.app`.

## 5. Volte ao Supabase
Em **Authentication > URL Configuration**:
- Site URL: `https://SEU-DOMINIO.vercel.app`
- Redirect URLs: inclua a mesma URL e, se necessário para desenvolvimento, `http://localhost:3000/**`.

## 6. Fechamento de segurança
Depois que a conta do seu sogro estiver criada, se o site for de uso individual, desabilite novos cadastros públicos ou restrinja o fluxo de criação de usuários. Nunca adicione a chave `service_role` à Vercel como `NEXT_PUBLIC_*`.
