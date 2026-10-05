"use client";
import { useEffect, useState } from "react";
import Login from "@/components/Login";
import FinanceApp from "@/components/FinanceApp";
import { createClient } from "@/lib/supabase/client";
export default function Home(){const [ready,setReady]=useState(false);const [email,setEmail]=useState<string|null>(null);useEffect(()=>{const s=createClient();s.auth.getUser().then(({data})=>{setEmail(data.user?.email||null);setReady(true)});const {data:sub}=s.auth.onAuthStateChange((_e,session)=>{setEmail(session?.user?.email||null);setReady(true)});return()=>sub.subscription.unsubscribe()},[]);if(!ready)return <div className="auth-page"><div className="auth-card">Carregando...</div></div>;return email?<FinanceApp email={email}/>:<Login/>}
