'use client';
import {useEffect,useState} from 'react';
import {useParams} from 'next/navigation';
import {ArrowLeft,ArrowUpRight,MapPin,Clock,Instagram,Tag,ShoppingBag} from 'lucide-react';
import type {Store} from '../../../lib/stores';
export default function StoreDetail(){
 const params=useParams();
 const id=typeof params.id==='string'?params.id:'';
 const [store,setStore]=useState<Store|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  if(!id)return;
  let active=true;
  fetch('/api/stores').then(async res=>{if(!res.ok)throw new Error('매장 목록을 불러올 수 없습니다.');return res.json()}).then(data=>{
   if(!active)return;
   const target=(data.stores||[]).find((s:Store)=>s.id.replace(/-/g,'')===id.replace(/-/g,''));
   setStore(target||null);setError(target?'':'공개된 매장 정보가 없거나 삭제된 매장입니다.');
  }).catch(()=>{if(active)setError('매장 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')})
  .finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[id]);
 return <main className="detailPage">
  <header className="detailHeader"><a href="/" className="detailLogo">VM<span className="logoDot">.</span></a><a href="/" className="detailBack"><ArrowLeft size={17}/> 전체 매장 목록</a></header>
  {loading?<div className="detailNotice">매장 정보를 불러오는 중...</div>:!store?<div className="detailNotice">{error||'매장 정보를 찾지 못했습니다.'}<p><a href="/">메인으로 돌아가기 ↗</a></p></div>:<>
   <div className="detailHero"><div className="detailPhoto">{store.photo?<img src={store.photo} alt={store.name+' 매장 대표 이미지'}/>:<div className="detailPhotoEmpty">VINTAGE MAP<br/>STORE DIRECTORY</div>}</div><div className="detailIntro"><span className="eyebrow">VINTAGE MAP / STORE PROFILE</span><p className="detailCity"><MapPin size={16}/>{[store.city,store.district].filter(Boolean).join(' · ')||'지역 정보 미등록'}</p><h1>{store.name}</h1><p>빈티지 매장 정보</p><div className="detailTags">{store.styles.length?store.styles.map(s=><span key={s}>{s}</span>):<span>스타일 정보 미등록</span>}</div><div className="detailQuickLinks">{store.mapUrl&&<a href={store.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17}/> 지도 열기 <ArrowUpRight size={15}/></a>}{store.instagram&&<a href={store.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={17}/> Instagram <ArrowUpRight size={15}/></a>}</div></div></div>
   <section className="detailInfo"><div className="detailSectionTitle"><span className="eyebrow">STORE INFORMATION</span><h2>매장 정보</h2><p>노션 VINTAGE MAP 데이터베이스의 공개 정보를 바탕으로 표시합니다.</p></div><div className="detailInfoGrid">
    <div className="detailInfoItem"><MapPin size={22}/><div><strong>위치 및 주소</strong><p>{store.address||[store.city,store.district].filter(Boolean).join(' · ')||'주소 정보 미등록'}</p></div></div>
    <div className="detailInfoItem"><Clock size={22}/><div><strong>운영시간</strong><p>{store.hours||'운영시간 정보 미등록'}</p></div></div>
    <div className="detailInfoItem"><Tag size={22}/><div><strong>패션 스타일</strong><p>{store.styles.join(' · ')||'스타일 정보 미등록'}</p></div></div>
    <div className="detailInfoItem"><ShoppingBag size={22}/><div><strong>취급 품목</strong><p>{store.items.join(' · ')||'취급 품목 정보 미등록'}</p></div></div>
   </div></section>
   <section className="detailLinks"><h2>매장 더 알아보기</h2><div>{store.mapUrl&&<a href={store.mapUrl} target="_blank" rel="noopener noreferrer">지도에서 보기 <ArrowUpRight size={17}/></a>}{store.instagram&&<a href={store.instagram} target="_blank" rel="noopener noreferrer">인스타그램 <ArrowUpRight size={17}/></a>}{store.notionUrl&&<a href={store.notionUrl} target="_blank" rel="noopener noreferrer">노션 원본 정보 <ArrowUpRight size={17}/></a>}</div></section>
  </>}
  <footer><div>VINTAGE MAP<span className="logoDot">.</span></div><p>CURATED FOR YOUR PERSONAL STYLE.</p></footer>
 </main>;
}
