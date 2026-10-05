export const brl=(n:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(n||0));
export const brDate=(s:string)=>s?new Date(`${s}T12:00:00`).toLocaleDateString("pt-BR"):"—";
export const monthKey=()=>new Date().toISOString().slice(0,7);
