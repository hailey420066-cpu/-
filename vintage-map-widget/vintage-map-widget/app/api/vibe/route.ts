import {NextResponse} from 'next/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const ID=process.env.NOTION_VIBE_DATA_SOURCE_ID||'379e0d6b-09ff-45c4-9bdc-137662de9ae4';
const text=(property:any):string=>{
 const blocks=property?.title||property?.rich_text||[];
 return blocks.map((x:any)=>x.plain_text??x.text?.content??'').join('');
};
export async function GET(){
 const token=process.env.NOTION_TOKEN;
 if(!token)return NextResponse.json({questions:[],configured:false,message:'노션 토큰이 설정되지 않았습니다.'},{headers:{'Cache-Control':'no-store'}});
 try{
  const rows:any[]=[];let cursor:string|undefined;
  for(let i=0;i<5;i++){
   const response=await fetch('https://api.notion.com/v1/data_sources/'+encodeURIComponent(ID)+'/query',{
    method:'POST',headers:{Authorization:'Bearer '+token,'Notion-Version':'2025-09-03','Content-Type':'application/json'},
    body:JSON.stringify({page_size:100,...(cursor?{start_cursor:cursor}:{})}),cache:'no-store'
   });
   if(!response.ok)throw Error('Notion API '+response.status);
   const json=await response.json();rows.push(...(json.results||[]));
   if(!json.has_more||!json.next_cursor)break;cursor=json.next_cursor;
  }
  const questions=rows.filter(p=>p.object==='page'&&p.properties?.['공개']?.checkbox===true).map(p=>{
   const raw=text(p.properties?.['선택지 JSON']);
   let options:any[]=[];
   try{const parsed=JSON.parse(raw.startsWith('DATA:')?raw.slice(5):raw);if(Array.isArray(parsed))options=parsed.filter(o=>typeof o.label==='string'&&Array.isArray(o.values)&&typeof o.reason==='string').map(o=>({label:o.label,values:o.values.filter((v:unknown)=>typeof v==='string'),reason:o.reason}));}catch{}
   return {id:p.id,title:text(p.properties?.['질문']),hint:text(p.properties?.['안내 문구']),weight:p.properties?.['가중치']?.number||1,order:p.properties?.['순서']?.number||999,options};
  }).filter(q=>q.title&&q.options.length>=2).sort((a,b)=>a.order-b.order);
  return NextResponse.json({questions,configured:true},{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=120'}});
 }catch(error){console.error('Failed to load vibe questions',error);return NextResponse.json({questions:[],configured:false,message:'질문 DB 접근 권한을 확인해 주세요.'},{headers:{'Cache-Control':'no-store'}})}
}
