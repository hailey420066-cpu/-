'use client';
import {useEffect,useMemo,useState} from 'react';
import {Heart,CalendarDays,Palette,MessageSquare,MapPin,ArrowUpRight} from 'lucide-react';
import type {Store} from '../lib/stores';
type Style={id:string;name:string;intro:string;details:string;items:string[];seasons:string[];image:string;storeIds:string[]};
type Event={id:string;name:string;date:string;city:string;place:string;price:string;status:string;kind:string;url:string;storeIds:string[]};
type Review={id:string;storeIds:string[];rating:number;comment:string};
const key='vintage-map-favorites-v1';
export default function Explore({stores}:{stores:Store[]}){
 const [data,setData]=useState<{styles:Style[],events:Event[],reviews:Review[],warnings:string[]}>({styles:[],events:[],reviews:[],warnings:[]});
 const [fav,setFav]=useState<string[]>([]);
 const [view,setView]=useState<'styles'|'events'|'saved'>('styles');
 const [showDemo,setShowDemo]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(key);if(raw)setFav(JSON.parse(raw))}catch{};fetch('/api/explore').then(r=>r.json()).then(x=>setData({styles:x.styles||[],events:x.events||[],reviews:x.reviews||[],warnings:x.warnings||[]})).catch(()=>setData(d=>({...d,warnings:['추가 콘텐츠를 불러오지 못했습니다.']})))},[]);
 const toggle=(id:string)=>setFav(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];try{localStorage.setItem(key,JSON.stringify(next))}catch{}return next});
 const saved=useMemo(()=>stores.filter(s=>fav.includes(s.id)),[stores,fav]);
 return <section className="explore" id="explore">
 <div className="exploreTop"><span className="eyebrow">BEYOND THE MAP</span><h2>EXPLORE VINTAGE.</h2><p>스타일을 발견하고, 빈티지 행사와 마음에 드는 매장을 모아보세요.</p></div>
 <nav className="exploreTabs" aria-label="추가 콘텐츠"><button className={view==='styles'?'active':''} onClick={()=>setView('styles')}><Palette size={17}/> STYLE ARCHIVE</button><button className={view==='events'?'active':''} onClick={()=>setView('events')}><CalendarDays size={17}/> POP-UPS & MARKETS</button><button className={view==='saved'?'active':''} onClick={()=>setView('saved')}><Heart size={17}/> SAVED ({fav.length})</button></nav>
 {view==='styles'&&<><div className="contentHeading"><h3>VINTAGE STYLE ARCHIVE</h3><span>{data.styles.length} STYLES</span></div>{data.styles.length===0?<p className="exploreNotice">스타일 정보를 가져오는 중이거나 노션 DB 연결 권한이 필요합니다.</p>:<div className="styleGrid">{data.styles.map(s=><article className="styleCard" key={s.id}><div className="stylePhoto">{s.image?<img src={s.image} alt={s.name+' 대표 스타일'} loading="lazy"/>:<div className="photoMissing">STYLE ARCHIVE</div>}</div><div className="styleInfo"><span className="eyebrow">STYLE GUIDE</span><h4>{s.name}</h4><p>{s.intro}</p><div className="styleTags">{s.items.slice(0,3).map(i=><span key={i}>{i}</span>)}</div><small>관련 매장 {s.storeIds.length}곳 · {s.seasons.join(' · ')}</small></div></article>)}</div>}</>}
 {view==='events'&&<><div className="contentHeading"><h3>POP-UPS & FLEA MARKETS</h3><span>EVENT CALENDAR</span></div><label className="demoToggle"><input type="checkbox" checked={showDemo} onChange={e=>setShowDemo(e.target.checked)}/> 기획용 데모 행사 보기 (실제 개최 정보 아님)</label><div className="eventList">{data.events.filter(e=>showDemo||e.kind!=='데모').length===0?<p className="exploreNotice">{showDemo?'등록된 행사가 없거나 DB 접근 권한이 필요합니다.':'현재 공개할 수 있는 확인된 행사가 없습니다. 데모 보기를 선택하면 예시 일정이 나타납니다.'}</p>:data.events.filter(e=>showDemo||e.kind!=='데모').map(e=><article className="eventRow" key={e.id}><div className="eventDate">{e.date||'미정'}</div><div className="eventMain"><h4>{e.name}</h4><p><MapPin size={13}/> {[e.city,e.place].filter(Boolean).join(' · ')} {e.price?' · '+e.price:''}</p></div><div className="eventRight">{e.kind==='데모'&&<span className="demoFlag">DEMO · 가상 일정</span>}{e.url&&e.kind!=='데모'&&<a href={e.url} target="_blank" rel="noopener noreferrer">안내 보기 <ArrowUpRight size={14}/></a>}</div></article>)}</div></>}
 {view==='saved'&&<><div className="contentHeading"><h3>MY SAVED STORES</h3><span>{saved.length} STORES</span></div><p className="savedHint">이 기기의 브라우저에만 저장됩니다. 노션의 방문자별 찜 DB와는 아직 동기화되지 않습니다.</p>{saved.length===0?<p className="exploreNotice">아직 찜한 매장이 없습니다. 아래 매장 목록에서 하트를 눌러 저장해 보세요.</p>:<div className="savedGrid">{saved.map(s=><div key={s.id} className="savedItem"><div><strong>{s.name}</strong><p>{s.city} · {s.district}</p></div><button onClick={()=>toggle(s.id)} aria-label={s.name+' 찜 취소'}><Heart size={18} fill="currentColor"/></button></div>)}</div>}</>}
 <div className="browseAll"><h3>FIND YOUR FAVORITES.</h3><p>매장 카드에서 하트를 눌러 나만의 빈티지 지도를 만들어 보세요.</p><div className="browseStoreGrid">{stores.map(s=><div className="browseStore" key={s.id}><span>{s.name}</span><button aria-label={s.name+(fav.includes(s.id)?' 찜 취소':' 찜하기')} onClick={()=>toggle(s.id)}><Heart size={18} fill={fav.includes(s.id)?'currentColor':'none'}/></button></div>)}</div></div>
 {data.warnings.length>0&&<p className="exploreWarning">{data.warnings.join(' ')}</p>}
 </section>;
}
