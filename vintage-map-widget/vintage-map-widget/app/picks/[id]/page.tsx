'use client';
import {useEffect,useState} from 'react';
import {useParams} from 'next/navigation';
import {ArrowLeft,ArrowUpRight,MapPin} from 'lucide-react';
import type {Store} from '../../../lib/stores';
type Pick={id:string;title:string;theme:string;intro:string;reason:string;verified:string;image:string;storeIds:string[]};
export default function PickDetail(){
 const params=useParams();const id=typeof params.id==='string'?params.id:'';
 const [pick,setPick]=useState<Pick|null>(null);const [stores,setStores]=useState<Store[]>([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;Promise.all([fetch('/api/picks').then(r=>r.json()),fetch('/api/stores').then(r=>r.json())]).then(([p,s])=>{if(!active)return;setPick((p.picks||[]).find((x:Pick)=>x.id.replace(/-/g,'')===id.replace(/-/g,''))||null);setStores(s.stores||[])}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[id]);
 const related=pick?stores.filter(s=>pick.storeIds.some(x=>x.replace(/-/g,'')===s.id.replace(/-/g,''))):[];
 return <main className="detailPage"><header className="detailHeader"><a href="/" className="detailLogo">VM<span className="logoDot">.</span></a><a className="detailBack" href="/"><ArrowLeft size={17}/> 컬렉션 목록</a></header>
 {loading?<div className="detailNotice">추천 컬렉션을 불러오는 중...</div>:!pick?<div className="detailNotice">추천 컬렉션을 찾지 못했습니다.<p><a href="/">메인으로 돌아가기 ↗</a></p></div>:<>
 <div className="pickDetailHero"><div className="pickDetailPhoto">{pick.image?<img src={pick.image} alt={pick.title+' 대표 이미지'}/>:<div className="detailPhotoEmpty">VINTAGE MAP<br/>EDITOR'S PICK</div>}</div><div className="pickDetailIntro"><span className="eyebrow">VINTAGE MAP / EDITOR'S PICK</span><span className="pickDetailTheme">{pick.theme||'EDITORIAL'}</span><h1>{pick.title}</h1><p>{pick.intro||'에디터가 선정한 빈티지 매장 컬렉션입니다.'}</p>{pick.reason&&<div className="pickDetailReason"><strong>WHY WE PICKED IT</strong><p>{pick.reason}</p></div>}{pick.verified!=='확인 완료'&&<small>기획용 추천 · 개별 매장의 정보는 방문 전 확인해 주세요.</small>}</div></div>
 <section className="pickDetailStores"><span className="eyebrow">CURATED PLACES</span><h2>추천 매장 <span>{related.length}</span></h2>{related.length?<div className="pickDetailGrid">{related.map(s=><a className="pickDetailStore" key={s.id} href={`/stores/${encodeURIComponent(s.id)}`} target="_blank" rel="noopener noreferrer"><div className="pickDetailStorePhoto">{s.photo?<img src={s.photo} alt={s.name+' 매장 사진'} loading="lazy"/>:<div className="editorPhotoFallback">VINTAGE MAP</div>}</div><div className="pickDetailStoreBody"><p><MapPin size={13}/>{[s.city,s.district].filter(Boolean).join(' · ')||'지역 정보 미등록'}</p><h3>{s.name}<ArrowUpRight size={19}/></h3><div>{s.styles.slice(0,4).map(t=><span key={t}>{t}</span>)}</div></div></a>)}</div>:<p className="exploreNotice">현재 공개된 연결 매장이 없습니다. 노션의 추천 매장 관계와 매장 공개 여부를 확인해 주세요.</p>}</section></>}
 <footer><div>VINTAGE MAP<span className="logoDot">.</span></div><p>CURATED FOR YOUR PERSONAL STYLE.</p></footer></main>
}
