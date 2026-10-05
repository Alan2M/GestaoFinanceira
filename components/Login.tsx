"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Login(){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false); const [signup,setSignup]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setLoading(true);setMsg("");const s=createClient();
   const r=signup?await s.auth.signUp({email,password}):await s.auth.signInWithPassword({email,password});
   if(r.error)setMsg(r.error.message);else if(signup&&!r.data.session)setMsg("Cadastro realizado. Confira seu e-mail para confirmar a conta.");else location.reload();setLoading(false);
 }
 return <main className="auth-page"><div className="auth-card"><h1>Meu Financeiro</h1><p>Controle financeiro familiar completo e privado.</p><form onSubmit={submit}><input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/>{msg&&<div className="auth-error">{msg}</div>}<button className="btn" disabled={loading}>{loading?"Aguarde...":signup?"Criar conta":"Entrar"}</button><button type="button" className="btn secondary" onClick={()=>{setSignup(!signup);setMsg("")}}>{signup?"Já tenho conta":"Criar uma conta"}</button></form></div></main>
}
