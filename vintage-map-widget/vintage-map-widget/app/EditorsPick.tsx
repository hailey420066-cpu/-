'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,MapPin} from 'lucide-react';
import type {Store} from '../lib/stores';
type Pick={id:string;title:string;theme:string;intro:string;reason:string;status:string;verified:string;order:number;image:string;storeIds:string[]};
export default function EditorsPick({stores}:{stores:Store[]}){
 const [picks,setPicks]=useState<Pick[]>([]);
 const [error,setError]=useState('');
 const [expanded,setExpanded]=useState<string|null>(null);
 useEffect(()=>{let active=true;fetch('/api/picks').then(r=>r.json()).then(d=>{if(active){setPicks(d.picks||[]);setError(d.error||'')}}).catch(()=>{if(active)setError('추천 콘텐츠를 불러오지 못했습니다.')});return()=>{active=false}},[]);
 return <section className="editorSection" aria-label="에디터 추천 매장"><div className="editorHeading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>EDITOR&apos;S PICK<span className="logoDot">.</span></h2><p>취향과 테마로 발견하는 빈티지샵 컬렉션.</p></div><span className="editorCounter">{picks.length} COLLECTIONS</span></div>
 {picks.length>0?<div className="editorGrid">{picks.map(p=>{const related=p.storeIds.map(id=>stores.find(s=>s.id.replace(/-/g,'')===id.replace(/-/g,''))).filter((s):s is Store=>Boolean(s));return <article className={"editorCard"+(expanded===p.id?" editorCardActive":"")} key={p.id}><button type="button" className="editorCardOpen" aria-expanded={expanded===p.id} aria-label={`${p.title} 추천 가게 목록 ${expanded===p.id?"접기":"펼치기"}`} onClick={()=>setExpanded(current=>current===p.id?null:p.id)}></button><div className="editorPhoto">{p.image?<img src={p.image} alt={p.title+' 대표 이미지'} loading="lazy"/>:<div className="editorPhotoFallback">VINTAGE MAP<br/>CURATED SELECTION</div>}<span className="editorTheme">{p.theme||'EDITORIAL'}</span></div><div className="editorBody"><div className="editorMeta">EDITOR&apos;S COLLECTION {p.verified!=='확인 완료'&&<span>· 기획용 추천</span>}</div><h3>{p.title}</h3><p>{p.intro}</p><div className="editorStores"><strong>RECOMMENDED STORES {expanded===p.id?"−":"+"}</strong>{expanded===p.id&&({related.length>0?<div className="editorStoreLinks">{related.map(s=><a href={`/stores/${encodeURIComponent(s.id)}`} target="_blank" rel="noopener noreferrer" key={s.id} title={s.name}><MapPin size={12}/>{s.name}</a>)}</div>:<span className="editorStoreEmpty">{p.storeIds.length>0?`${p.storeIds.length}개 연결된 매장 중 공개된 정보가 없습니다.`:'연결된 추천 매장이 없습니다.'}</span>})}</div></div></article>})}</div>:<p className="editorEmpty">{error||'추천 콘텐츠를 불러오는 중입니다.'}</p>}</section>;
}
