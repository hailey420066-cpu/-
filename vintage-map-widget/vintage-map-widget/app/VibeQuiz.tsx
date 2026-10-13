'use client';
import {useMemo,useState} from 'react';
import {ArrowRight,ArrowLeft,RotateCcw,MapPin,ArrowUpRight,Sparkles} from 'lucide-react';
import type {Store} from '../lib/stores';

type Vibe='아메카지'|'고프코어'|'Y2K'|'고스'|'워크웨어'|'미니멀'|'스트릿'|'그런지';
const vibes:Vibe[]=['아메카지','고프코어','Y2K','고스','워크웨어','미니멀','스트릿','그런지'];
const about:Record<Vibe,string>={
 '아메카지':'편안한 실루엣과 시간이 지날수록 멋스러운 클래식 캐주얼.',
 '고프코어':'아웃도어의 기능성과 도시적인 실용성을 함께 즐기는 취향.',
 'Y2K':'2000년대 감성의 대담한 색과 실루엣을 즐기는 취향.',
 '고스':'어두운 색감과 강렬한 디테일로 분위기를 만드는 취향.',
 '워크웨어':'튼튼한 소재, 포켓, 데님 등 기능에서 출발한 멋.',
 '미니멀':'간결한 디자인과 균형 잡힌 실루엣에 집중하는 취향.',
 '스트릿':'넉넉한 핏과 그래픽으로 자유롭게 개성을 표현하는 취향.',
 '그런지':'낡은 질감, 레이어드, 거친 무드를 자연스럽게 즐기는 취향.'
};
type Option={label:string;values:Vibe[]};
const questions:{title:string;hint:string;options:Option[]}[]=[
 {title:'오늘 가장 끌리는 착장은?',hint:'직감대로 하나를 골라 봐.',options:[
  {label:'데님과 체크 셔츠, 자연스러운 레이어드',values:['아메카지','워크웨어']},
  {label:'바람막이와 카고 팬츠, 활동적인 룩',values:['고프코어','스트릿']},
  {label:'크롭 상의와 볼드한 액세서리',values:['Y2K','스트릿']},
  {label:'올블랙과 빈티지 가죽 재킷',values:['고스','그런지']}
 ]},
 {title:'옷을 고를 때 가장 중요한 건?',hint:'자주 손이 가는 기준을 선택해 줘.',options:[
  {label:'오래 입을 수 있는 소재와 디테일',values:['워크웨어','아메카지']},
  {label:'편안함과 실용적인 기능',values:['고프코어','미니멀']},
  {label:'눈에 띄는 포인트와 개성',values:['Y2K','스트릿']},
  {label:'독특한 분위기와 자유로운 조합',values:['그런지','고스']}
 ]},
 {title:'좋아하는 색 조합은?',hint:'옷장에 가장 어울리는 색감을 떠올려 봐.',options:[
  {label:'카키, 브라운, 인디고',values:['아메카지','워크웨어']},
  {label:'그레이, 블랙, 화이트',values:['미니멀','고프코어']},
  {label:'실버, 핑크, 강렬한 원색',values:['Y2K','스트릿']},
  {label:'블랙, 버건디, 워싱된 색감',values:['고스','그런지']}
 ]},
 {title:'빈티지샵에서 가장 먼저 보는 건?',hint:'실제로 쇼핑하는 모습을 상상해 봐.',options:[
  {label:'오래된 데님, 밀리터리 재킷',values:['워크웨어','아메카지']},
  {label:'기능성 아우터, 테크웨어',values:['고프코어','미니멀']},
  {label:'희귀 그래픽 티셔츠, 개성 있는 소품',values:['스트릿','Y2K']},
  {label:'밴드 티셔츠, 가죽, 워싱 아이템',values:['그런지','고스']}
 ]}
];
const normalized=(s:string)=>s.toLocaleLowerCase('ko').replace(/[^a-z0-9가-힣]/g,'');
const aliases:Record<Vibe,string[]>={
 '아메카지':['아메카지','amekaji','아메리칸캐주얼'],
 '고프코어':['고프코어','gorpcore','아웃도어'],
 'Y2K':['y2k','와이투케이'],
 '고스':['고스','goth','고딕'],
 '워크웨어':['워크웨어','workwear','워크웨어빈티지'],
 '미니멀':['미니멀','minimal','미니멀리즘'],
 '스트릿':['스트릿','스트리트','street','스트릿웨어'],
 '그런지':['그런지','grunge']
};
export default function VibeQuiz({stores}:{stores:Store[]}){
 const [answers,setAnswers]=useState<number[]>([]);
 const [started,setStarted]=useState(false);
 const [finished,setFinished]=useState(false);
 const [city,setCity]=useState('');
 const index=answers.length;
 const result=useMemo(()=>{
  const scores=Object.fromEntries(vibes.map(v=>[v,0])) as Record<Vibe,number>;
  answers.forEach((choice,qi)=>questions[qi]?.options[choice]?.values.forEach((v,i)=>scores[v]+=i===0?2:1));
  return [...vibes].sort((a,b)=>scores[b]-scores[a]||vibes.indexOf(a)-vibes.indexOf(b)).slice(0,2);
 },[answers]);
 const matches=useMemo(()=>stores.filter(store=>store.styles.some(style=>aliases[result[0]].some(name=>normalized(style)===normalized(name)||normalized(style).includes(normalized(name))))&&(!city||store.city===city)),[stores,result,city]);
 const cities=[...new Set(stores.map(s=>s.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
 const restart=()=>{setAnswers([]);setStarted(false);setFinished(false);setCity('')};
 return <section id="vibe" className="vibeSection"><div className="vibeHeader"><div><span className="eyebrow">DISCOVER YOUR STYLE</span><h2>FIND YOUR <em>VIBE.</em></h2><p>4개의 질문으로 나에게 어울리는 빈티지 스타일과 매장을 발견해 보세요.</p></div><Sparkles size={34} strokeWidth={1.3}/></div>
 {!started?<div className="vibeWelcome"><div><span>01 — 04 / QUICK STYLE QUIZ</span><h3>당신의 빈티지 취향은?</h3><p>정답은 없어. 마음이 끌리는 선택지만 골라 줘.</p></div><button onClick={()=>setStarted(true)}>테스트 시작 <ArrowRight size={19}/></button></div>:
 !finished?<div className="vibePanel"><div className="vibeProgress"><span>QUESTION {String(index+1).padStart(2,'0')} / 04</span><div><i style={{width:`${index/4*100}%`}}/></div></div><h3>{questions[index].title}</h3><p>{questions[index].hint}</p><div className="vibeOptions">{questions[index].options.map((opt,i)=><button key={i} onClick={()=>{setAnswers(prev=>[...prev,i]);if(index===3)setFinished(true)}}><span>{String(i+1).padStart(2,'0')}</span>{opt.label}<ArrowUpRight size={17}/></button>)}</div><div className="vibeBottom"><button onClick={()=>setAnswers(prev=>prev.slice(0,-1))} disabled={index===0}><ArrowLeft size={15}/> 이전 질문</button><button onClick={restart}>처음부터</button></div></div>:
 <div className="vibeResult"><span className="eyebrow">YOUR VINTAGE DNA</span><h3>당신의 스타일은 <em>{result[0]}</em></h3><p>{about[result[0]]}</p><div className="vibeSub">함께 어울리는 스타일 <strong>{result[1]}</strong></div><div className="vibeMatches"><div className="vibeMatchHeading"><div><span className="eyebrow">MATCHED STORES</span><h4>당신의 취향에 어울리는 매장</h4></div><select aria-label="추천 매장 지역 선택" value={city} onChange={e=>setCity(e.target.value)}><option value="">전국</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select></div>{matches.length?<div className="vibeStoreGrid">{matches.slice(0,6).map(s=><a key={s.id} href={`/stores/${encodeURIComponent(s.id)}`} target="_blank" rel="noopener noreferrer" className="vibeStore"><div><strong>{s.name}</strong><span><MapPin size={13}/>{[s.city,s.district].filter(Boolean).join(' · ')}</span></div><ArrowUpRight size={20}/></a>)}</div>:<p className="vibeNoStores">현재 선택한 지역에 이 스타일로 등록된 공개 매장이 없어요. 다른 지역을 선택해 보세요.</p>}</div><button className="vibeRestart" onClick={restart}><RotateCcw size={16}/> 다시 테스트하기</button></div>}
 </section>;
}
