'use client';
import {useEffect,useMemo,useState} from 'react';

// Editorial inspiration photographs, not photographs of the listed stores.
// Stable Unsplash image IDs are distributed across cards to avoid repetition.
const inspiration = [
 'photo-1441986300917-64674bd600d8',
 'photo-1483985988355-763728e1935b',
 'photo-1445205170230-053b83016050',
 'photo-1490481651871-ab68de25d43d',
 'photo-1473181488821-2d23949a045a',
 'photo-1512436991641-6745cdb1723f',
 'photo-1503342217505-b0a15ec3261c',
 'photo-1496747611176-843222e1e57c',
 'photo-1564584217132-2271feaeb3c5',
 'photo-1532453288672-3a27e9be9efd',
 'photo-1479064555552-3ef4979f8908',
 'photo-1434389677669-e08b4cac3105'
];
function hash(s:string){let n=0;for(let i=0;i<s.length;i++)n=(n*31+s.charCodeAt(i))>>>0;return n}
function url(id:string){return 'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=900&h=700&q=78'}
export default function StorePhoto({storeId,storeName,actualPhoto}:{storeId:string,storeName:string,actualPhoto:string}){
 const seed=useMemo(()=>hash(storeId),[storeId]);
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{setAttempt(0)},[actualPhoto,storeId]);
 const hasActual=Boolean(actualPhoto)&&attempt===0;
 const backupIndex=(seed+Math.max(0,attempt-(actualPhoto?1:0))*5)%inspiration.length;
 const source=hasActual?actualPhoto:url(inspiration[backupIndex]);
 return <div className="storePhotoFill"><img src={source} alt={hasActual?storeName+' 매장 사진':'빈티지 의류와 쇼핑 분위기를 보여주는 참고 사진'} loading="lazy" onError={()=>setAttempt(n=>n<4?n+1:4)}/>{!hasActual&&<span className="photoReference">STYLE REFERENCE · 참고 이미지</span>}</div>;
}
