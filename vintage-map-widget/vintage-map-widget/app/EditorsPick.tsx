'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,MapPin} from 'lucide-react';
import type {Store} from '../lib/stores';
type Pick={id:string;title:string;theme:string;intro:string;reason:string;status:string;verified:string;order:number;image:string;storeIds:string[]};
export default function EditorsPick({stores}:{stores:Store[]}){
 const [picks,setPicks]=useState<Pick[]>([]);
 const [error,setError]=useState('');
 useEffect(()=>{let active=true;fetch('/api/picks').then(r=>r.json()).then(d=>{if(active){setPicks(d.picks||[]);setError(d.error||'')}}).catch(()=>{if(active)setError('추천 콘텐츠를 불러오지 못했습니다.')});return()=>{active=false}},[]);
 return <section className="editorSection" aria-label="에디터 추천 매장"><div className="editorHeading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>EDITOR&apos;S PICK<span className="logoDot">.</span></h2><p>취향과 테마로 발견하는 빈티지샵 컬렉션.</p></div><span className="editorCounter">{picks.length} COLLECTIONS</span></div>
 {picks.length>0?<div className="editorGrid">{picks.map(p=>{const related=p.storeIds.map(id=>stores.find(s=>s.id.replace(/-/g,'')===id.replace(/-/g,''))).filter((s):s is Store=>Boolean(s));return <article className="editorCard" key={p.id}><div className="editorPhoto">{p.image?<img src={p.image} alt={p.title+' 대표 이미지'} loading="lazy"/>:<div className="editorPhotoFallback">VINTAGE MAP<br/>CURATED SELECTION</div>}<span className="editorTheme">{p.theme||'EDITORIAL'}</span></div><div className="editorBody"><div className="editorMeta">EDITOR&apos;S COLLECTION {p.verified!=='확인 완료'&&<span>· 기획용 추천</span>}</div><h3>{p.title}</h3><p>{p.intro}</p><div className="editorStores"><strong>RECOMMENDED STORES</strong>{related.length>0?<div className="editorStoreLinks">{related.map(s=><a href={'#stores'} key={s.id} onClick={()=>{}} title={s.name}><MapPin size={12}/>{s.name}</a>)}</div>:<span className="editorStoreEmpty">{p.storeIds.length}개 매장 연결됨 · 매장 정보를 불러오는 중</span>}</div></div></article>})}</div>:<p className="editorEmpty">{error||'추천 콘텐츠를 불러오는 중입니다.'}</p>}</section>;
}
