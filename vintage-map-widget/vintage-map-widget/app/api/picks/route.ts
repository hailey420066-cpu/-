import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const ID='bbc1e5d8-5fe7-49b0-9ac6-2192373fe048';
const plain=(p:any):string=>p?.type==='title'?(p.title||[]).map((v:any)=>v.plain_text||v.text?.content||'').join(''):p?.type==='rich_text'?(p.rich_text||[]).map((v:any)=>v.plain_text||v.text?.content||'').join(''):p?.type==='select'?p.select?.name||'':'';
export async function GET(){
 const token=process.env.NOTION_TOKEN;
 if(!token)return NextResponse.json({picks:[],error:'노션 연결 설정이 필요합니다.'});
 try{
  const res=await fetch('https://api.notion.com/v1/data_sources/'+ID+'/query',{method:'POST',headers:{Authorization:'Bearer '+token,'Notion-Version':'2025-09-03','Content-Type':'application/json'},body:JSON.stringify({page_size:100}),cache:'no-store'});
  if(!res.ok)throw new Error('Notion API '+res.status);
  const data=await res.json();
  const picks=(data.results||[]).filter((p:any)=>p.object==='page').map((p:any)=>({
   id:p.id,title:plain(p.properties?.['추천 컬렉션']),theme:plain(p.properties?.['테마']),
   intro:plain(p.properties?.['소개 문구']),reason:plain(p.properties?.['추천 이유']),
   status:plain(p.properties?.['공개 상태']),verified:plain(p.properties?.['검증 여부']),
   order:p.properties?.['노출 순서']?.number||99,
   image:(p.properties?.['대표 이미지']?.files||[]).map((f:any)=>f.file?.url||f.external?.url||'').find(Boolean)||'',
   storeIds:(p.properties?.['추천 매장']?.relation||[]).map((r:any)=>r.id)
  })).filter((p:any)=>p.title).sort((a:any,b:any)=>a.order-b.order);
  return NextResponse.json({picks},{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=120'}});
 }catch(e){return NextResponse.json({picks:[],error:'에디터 추천 데이터를 불러오지 못했습니다.'},{status:200})}
}
