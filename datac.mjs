/**
 * data.mjs
 * (C)2024 Haesung Kim, All Rights Reserved
 * ------------------------------------------------------------------
 * v1.0.0
 * ------------------------------------------------------------------
 */
"use strict";const getCases=async function(){let resP=["KOSPI","KOSDAQ"].map((item=>fetch(`https://finance.daum.net/api/trend/trade_volume/sudden_changes?page=1&perPage=100&fieldName=accTradeVolumeChangeRate&order=desc&market=${item}&pagination=true&suddenChangeType=INCREASE`))),res=await Promise.all(resP),jsonP=res.map((item=>item.json()));const two=await Promise.all(jsonP),quotes=two.reduce(((acc1,item)=>[...acc1,...item.data.reduce(((acc2,stock)=>("RISE"===stock.change&&stock.changeRate>=.05&&acc2.push({code:stock.symbolCode,name:stock.name}),acc2)),[])]),[]);resP=quotes.map((async quote=>{const code=quote.code;return fetch(`https://finance.daum.net/api/quote/${code}/days?symbolCode=${code}&page=1&perPage=80&pagination=true`)})),res=await Promise.all(resP),jsonP=res.map((item=>item.json()));return(await Promise.all(jsonP)).reduce(((acc,stock,index)=>{if(stock.totalPages>=4){const closePrices=[],volumes=[];stock.data.forEach((item=>{closePrices.push(item.tradePrice),volumes.push(item.accTradeVolume)}));const sk=`${quotes[index].code}-${quotes[index].name}`;acc.push({sk:sk,closePrices:closePrices,volumes:volumes})}return acc}),[])},getDate=async function(){const res=await fetch("https://finance.daum.net/api/business_dates?exchangeCountry=KOREA&limit=1");return(await res.json())[0].date};export{getCases,getDate};
