import {NextResponse} from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const SOURCES = {
  styles: process.env.NOTION_STYLES_DATA_SOURCE_ID || 'bd333657-8f1a-4b07-8b45-4bd51a355390',
  events: process.env.NOTION_EVENTS_DATA_SOURCE_ID || '224e059a-c421-484e-b80e-4fcc9914160f',
  reviews: process.env.NOTION_REVIEWS_DATA_SOURCE_ID || '47ef1aa7-0fb2-4086-96a5-92aba5b45958'
};
const plain=(p:any):string=> p?.type==='title'?(p.title||[]).map((v:any)=>v.plain_text||v.text?.content||'').join(''):p?.type==='rich_text'?(p.rich_text||[]).map((v:any)=>v.plain_text||v.text?.content||'').join(''):p?.type==='select'?p.select?.name||'':'';
const arr=(p:any):string[] => (p?.multi_select||[]).map((v:any)=>v.name);
const relation=(p:any):string[] => (p?.relation||[]).map((v:any)=>v.id);
const file=(p:any):string => (p?.files||[]).map((v:any)=>v.file?.url||v.external?.url||'').find(Boolean)||'';
async function query(id:string,token:string){
  const results:any[]=[];let cursor:string|undefined;
  for(let page=0;page<8;page++){
    const resp=await fetch('https://api.notion.com/v1/data_sources/'+encodeURIComponent(id)+'/query',{
      method:'POST',headers:{Authorization:'Bearer '+token,'Notion-Version':'2025-09-03','Content-Type':'application/json'},
      body:JSON.stringify({page_size:100,...(cursor?{start_cursor:cursor}:{})}),cache:'no-store'
    });
    if(!resp.ok) throw new Error('Notion '+resp.status+' on '+id);
    const data=await resp.json(); results.push(...(data.results||[]));
    if(!data.has_more||!data.next_cursor)break;cursor=data.next_cursor;
  }
  return results.filter(p=>p.object==='page');
}
export async function GET(){
  const token=process.env.NOTION_TOKEN;
  if(!token)return NextResponse.json({styles:[],events:[],reviews:[],warnings:['NOTION_TOKEN 미설정']});
  const keys=['styles','events','reviews'] as const;
  const fetched=await Promise.allSettled(keys.map(k=>query(SOURCES[k],token)));
  const warnings:string[]=[];
  const get=(i:number)=>(fetched[i].status==='fulfilled'?(fetched[i] as PromiseFulfilledResult<any[]>).value:(warnings.push(keys[i]+' DB 접근 권한이 없습니다.'),[]));
  const styles=get(0).map(p=>({id:p.id,name:plain(p.properties?.['스타일명']),intro:plain(p.properties?.['한줄 소개']),details:plain(p.properties?.['스타일 특징']),items:arr(p.properties?.['추천 아이템']),seasons:arr(p.properties?.['추천 계절']),image:file(p.properties?.['이미지']),storeIds:relation(p.properties?.['관련 매장'])})).filter(p=>p.name);
  const events=get(1).map(p=>({id:p.id,name:plain(p.properties?.['행사명']),date:p.properties?.['일정']?.date?.start||'',city:plain(p.properties?.['도시']),place:plain(p.properties?.['장소']),price:plain(p.properties?.['입장료']),status:plain(p.properties?.['진행 상태']),kind:plain(p.properties?.['정보 유형']),url:p.properties?.['안내 링크']?.url||'',storeIds:relation(p.properties?.['참가 매장'])})).filter(p=>p.name).sort((a,b)=>a.date.localeCompare(b.date));
  // Only approved real user reviews should ever be displayed publicly. Hidden demo reviews remain hidden.
  const reviews=get(2).filter(p=>plain(p.properties?.['후기 유형'])!=='데모' && plain(p.properties?.['상태'])==='승인').map(p=>({id:p.id,storeIds:relation(p.properties?.['연결 매장']),rating:p.properties?.['별점']?.number||0,comment:plain(p.properties?.['댓글'])})).filter(p=>p.storeIds.length>0);
  return NextResponse.json({styles,events,reviews,warnings},{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=120'}});
}
