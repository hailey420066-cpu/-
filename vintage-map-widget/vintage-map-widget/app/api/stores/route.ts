import {NextResponse} from 'next/server';
import {asStore} from '../../../lib/stores';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
let memory: { at:number; stores:ReturnType<typeof asStore>[] } | null = null;
export async function GET() {
  const token = process.env.NOTION_TOKEN;
  const datasource = process.env.NOTION_DATA_SOURCE_ID;
  if (!token || !datasource || token === 'secret_replace_me') {
    return NextResponse.json({stores:[], configured:false, message:'노션 연결 전입니다. Vercel 환경변수를 설정해 주세요.'},{headers:{'Cache-Control':'no-store'}});
  }
  if (memory && Date.now() - memory.at < 120000) return NextResponse.json({stores:memory.stores,configured:true});
  try {
    const stores:ReturnType<typeof asStore>[] = [];
    let cursor:string|undefined;
    for (let page=0; page<10; page++) {
      const response:Response = await fetch(`https://api.notion.com/v1/data_sources/${encodeURIComponent(datasource)}/query`,{
        method:'POST', headers:{Authorization:`Bearer ${token}`,'Notion-Version':'2025-09-03','Content-Type':'application/json'},
        body:JSON.stringify({page_size:100,...(cursor?{start_cursor:cursor}:{})}),cache:'no-store'
      });
      if(!response.ok) throw new Error(`Notion API ${response.status}: ${(await response.text()).slice(0,240)}`);
      const data = await response.json();
      for (const item of data.results || []) {
        const published = item.properties?.['공개 여부']?.checkbox === true;
        // 다른 사람이 접속하는 위젯에 비공개 후보가 유출되지 않게 기본적으로 숨김.
        if ((process.env.PUBLIC_ONLY || 'true').toLowerCase() !== 'false' && !published) continue;
        if (item.object !== 'page') continue;
        const store = asStore(item);
        if (store.name) stores.push(store);
      }
      if(!data.has_more || !data.next_cursor) break;
      cursor = data.next_cursor;
    }
    memory = {at:Date.now(),stores};
    return NextResponse.json({stores,configured:true},{headers:{'Cache-Control':'public, s-maxage=30, stale-while-revalidate=90'}});
  } catch(err) {
    console.error('Failed to query Notion:',err);
    return NextResponse.json({stores:[],configured:false,message:'노션 데이터를 불러오지 못했어요. 토큰과 DB 연결 권한을 확인해 주세요.'},{status:502,headers:{'Cache-Control':'no-store'}});
  }
}
