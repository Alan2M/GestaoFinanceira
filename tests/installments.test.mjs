import test from 'node:test';
import assert from 'node:assert/strict';
import { addMonths, firstCardDueDate, splitInstallments } from '../lib/installments.ts';
test('mês curto não salta fevereiro',()=>{assert.equal(addMonths('2026-01-31',1),'2026-02-28');assert.equal(addMonths('2028-01-31',1),'2028-02-29');assert.equal(addMonths('2026-01-31',2),'2026-03-31')});
test('compra antes do fechamento vence após o fechamento',()=>{assert.equal(firstCardDueDate('2026-10-19',20,10),'2026-11-10');assert.equal(firstCardDueDate('2026-10-21',20,10),'2026-12-10')});
test('vencimento ainda no mês de fechamento quando dia posterior',()=>{assert.equal(firstCardDueDate('2026-10-10',15,25),'2026-10-25')});
test('dias 31 e fevereiro',()=>{assert.equal(firstCardDueDate('2026-02-28',31,10),'2026-03-10');assert.equal(firstCardDueDate('2026-03-31',30,10),'2026-05-10')});
test('parcelamento em centavos preserva soma',()=>{assert.deepEqual(splitInstallments(100,3),[33.33,33.33,33.34]);assert.equal(splitInstallments(1199.9,12).reduce((a,b)=>a+Math.round(b*100),0),119990)});
test('validação de parcelas',()=>{assert.throws(()=>splitInstallments(1,0));assert.throws(()=>splitInstallments(0.01,2));assert.throws(()=>splitInstallments(30,121))});
