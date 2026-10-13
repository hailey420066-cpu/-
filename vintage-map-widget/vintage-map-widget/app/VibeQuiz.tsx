'use client';
import {useEffect,useMemo,useState} from 'react';
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
type Option={label:string;values:Vibe[];reason:string};
const defaultQuestions:{title:string;hint:string;weight:number;options:Option[]}[]=[
 {title:'실제로 가장 자주 입고 싶은 착장은?',hint:'유행보다 일상에서 손이 갈 옷을 골라줘.',weight:3,options:[
 {label:'워크 재킷, 생지 데님, 가죽 부츠',values:['워크웨어','아메카지'],reason:'탄탄한 데님과 실용적인 디테일'},
 {label:'니트, 치노 팬츠, 자연스러운 레이어드',values:['아메카지','미니멀'],reason:'편안하고 클래식한 레이어드'},
 {label:'셸 재킷, 카고 팬츠, 트레일화',values:['고프코어','스트릿'],reason:'기능적인 아웃도어 실루엣'},
 {label:'와이드 팬츠, 프린트 티, 스니커즈',values:['스트릿','Y2K'],reason:'루즈한 실루엣과 그래픽'},
 {label:'워싱 티, 가죽 재킷, 빈티지 부츠',values:['그런지','고스'],reason:'거친 질감과 어두운 분위기'},
 {label:'깔끔한 셔츠, 슬랙스, 단정한 아우터',values:['미니멀','아메카지'],reason:'절제된 핏과 정돈된 스타일'}
 ]},
 {title:'가장 끌리는 전체적인 분위기는?',hint:'멋있다고 느끼는 이미지에 가까운 걸 선택해.',weight:3,options:[
 {label:'시간이 쌓인 클래식 캐주얼',values:['아메카지','워크웨어'],reason:'오래 입는 클래식한 무드'},
 {label:'거칠고 실용적인 작업복',values:['워크웨어','아메카지'],reason:'작업복 기반의 스타일'},
 {label:'도시적인 아웃도어',values:['고프코어','미니멀'],reason:'활동적인 테크니컬 무드'},
 {label:'90~2000년대의 장난스럽고 화려한 감각',values:['Y2K','스트릿'],reason:'레트로 팝 무드'},
 {label:'반항적이고 낡은 록 음악 같은 감성',values:['그런지','고스'],reason:'낡고 반항적인 록 무드'},
 {label:'어둡고 드라마틱한 실루엣',values:['고스','그런지'],reason:'극적인 다크 무드'},
 {label:'조용하고 단정한 균형감',values:['미니멀','아메카지'],reason:'간결한 미니멀 무드'},
 {label:'자유롭고 과감한 도시 패션',values:['스트릿','Y2K'],reason:'표현적인 스트리트 무드'}
 ]},
 {title:'좋아하는 바지의 형태는?',hint:'평소 입고 싶은 핏을 기준으로 골라줘.',weight:2,options:[
 {label:'스트레이트 데님 또는 치노',values:['아메카지','워크웨어'],reason:'정통 스트레이트 핏'},
 {label:'포켓이 풍부한 카고 팬츠',values:['고프코어','워크웨어'],reason:'포켓과 기능성'},
 {label:'매우 넉넉한 배기 데님',values:['스트릿','Y2K'],reason:'과감한 볼륨'},
 {label:'로우라이즈 또는 부츠컷',values:['Y2K','그런지'],reason:'2000년대 실루엣'},
 {label:'슬림한 블랙 팬츠 또는 디스트로이드 진',values:['고스','그런지'],reason:'어두운 슬림 실루엣'},
 {label:'군더더기 없는 슬랙스',values:['미니멀','아메카지'],reason:'깔끔한 실루엣'}
 ]},
 {title:'가장 사고 싶은 아우터는?',hint:'지금 옷장에 하나 추가한다면?',weight:3,options:[
 {label:'빈티지 데님 재킷',values:['아메카지','워크웨어'],reason:'빈티지 데님의 매력'},
 {label:'캔버스 초어 재킷',values:['워크웨어','아메카지'],reason:'튼튼한 워크 재킷'},
 {label:'테크니컬 윈드브레이커',values:['고프코어','스트릿'],reason:'기능성 셸 아우터'},
 {label:'크롭 퍼 재킷 또는 트랙 재킷',values:['Y2K','스트릿'],reason:'레트로 스포츠 디테일'},
 {label:'오버사이즈 후디 또는 봄버',values:['스트릿','그런지'],reason:'자유로운 오버사이즈'},
 {label:'낡은 가죽 재킷',values:['그런지','고스'],reason:'빈티지 가죽과 워싱'},
 {label:'블랙 롱코트',values:['고스','미니멀'],reason:'날카롭고 긴 실루엣'},
 {label:'심플한 싱글 코트',values:['미니멀','아메카지'],reason:'정돈된 클래식 아우터'}
 ]},
 {title:'패턴과 디테일은 어느 쪽이 좋아?',hint:'자주 입는 옷에 가까운 걸 골라줘.',weight:2,options:[
 {label:'체크, 패치, 빈티지 자수',values:['아메카지','워크웨어'],reason:'빈티지 패턴과 자수'},
 {label:'굵은 스티치, 포켓, 견고한 소재',values:['워크웨어','고프코어'],reason:'기능적인 제작 디테일'},
 {label:'지퍼, 스트링, 리플렉티브 소재',values:['고프코어','스트릿'],reason:'테크니컬 디테일'},
 {label:'글리터, 로고, 컬러 포인트',values:['Y2K','스트릿'],reason:'화려한 디테일'},
 {label:'그래픽 프린트와 스니커즈',values:['스트릿','Y2K'],reason:'그래픽 중심의 스타일'},
 {label:'찢어진 옷, 페이드, 레이어드',values:['그런지','고스'],reason:'워싱과 레이어드'},
 {label:'레이스, 메시, 버클, 금속 장식',values:['고스','그런지'],reason:'다크한 장식'},
 {label:'장식 없는 단색과 좋은 소재',values:['미니멀','아메카지'],reason:'절제된 디테일'}
 ]},
 {title:'어떤 색 조합을 가장 자주 입을까?',hint:'색은 보조 지표라서 너무 고민하지 않아도 돼.',weight:1,options:[
 {label:'브라운, 올리브, 인디고',values:['아메카지','워크웨어'],reason:'어스톤 컬러'},
 {label:'카키, 회색, 차콜',values:['고프코어','워크웨어'],reason:'차분한 아웃도어 컬러'},
 {label:'실버, 핑크, 선명한 원색',values:['Y2K','스트릿'],reason:'생동감 있는 컬러'},
 {label:'검정, 버건디, 짙은 보라',values:['고스','그런지'],reason:'다크 팔레트'},
 {label:'먹색, 바랜 검정, 탁한 컬러',values:['그런지','스트릿'],reason:'페이드된 컬러'},
 {label:'흰색, 베이지, 검정',values:['미니멀','아메카지'],reason:'뉴트럴 컬러'}
 ]},
 {title:'평소 즐겨 신을 신발은?',hint:'착장의 마지막을 완성하는 신발이야.',weight:2,options:[
 {label:'가죽 로퍼, 클래식 캔버스화',values:['아메카지','미니멀'],reason:'클래식 슈즈'},
 {label:'워커 또는 견고한 부츠',values:['워크웨어','그런지'],reason:'견고한 부츠'},
 {label:'트레일 러닝화, 하이킹화',values:['고프코어','스트릿'],reason:'아웃도어 신발'},
 {label:'플랫폼 슈즈, 레트로 러닝화',values:['Y2K','스트릿'],reason:'Y2K 슈즈'},
 {label:'스케이트 슈즈, 볼드 스니커즈',values:['스트릿','Y2K'],reason:'스트릿 스니커즈'},
 {label:'낡은 캔버스화, 닥터마틴 스타일',values:['그런지','고스'],reason:'록 감성 신발'},
 {label:'포인트 있는 블랙 부츠',values:['고스','그런지'],reason:'다크 부츠'},
 {label:'심플한 단색 스니커즈',values:['미니멀','아메카지'],reason:'절제된 스니커즈'}
 ]},
 {title:'마지막! 빈티지샵에서 가장 먼저 찾을 아이템은?',hint:'쇼핑 행동과 연결되는 중요한 질문이야.',weight:3,options:[
 {label:'오래된 밀리터리 셔츠와 빈티지 니트',values:['아메카지','워크웨어'],reason:'밀리터리와 클래식 빈티지'},
 {label:'워크 팬츠, 초어 코트, 헤비 데님',values:['워크웨어','아메카지'],reason:'헤비 듀티 워크웨어'},
 {label:'아웃도어 플리스와 기능성 셸',values:['고프코어','스트릿'],reason:'기능성 아웃도어 아이템'},
 {label:'2000년대 그래픽 탑과 액세서리',values:['Y2K','스트릿'],reason:'2000년대 액세서리'},
 {label:'희귀 그래픽 티셔츠와 후디',values:['스트릿','Y2K'],reason:'스트릿 그래픽 아이템'},
 {label:'밴드 티셔츠, 찢어진 데님',values:['그런지','고스'],reason:'워싱과 밴드 티셔츠'},
 {label:'레이스 셔츠, 블랙 레더, 실버 주얼리',values:['고스','그런지'],reason:'다크한 아이템'},
 {label:'심플한 셔츠, 베이직 재킷',values:['미니멀','아메카지'],reason:'기본에 충실한 옷'}
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
 const [questions,setQuestions]=useState(defaultQuestions);
 const [questionSource,setQuestionSource]=useState<'loading'|'notion'|'fallback'>('loading');
 const [answers,setAnswers]=useState<number[]>([]);
 const [started,setStarted]=useState(false);
 const [finished,setFinished]=useState(false);
 const [city,setCity]=useState('');
 useEffect(()=>{let active=true;fetch('/api/vibe').then(r=>r.json()).then(data=>{if(!active)return;if(data.configured&&Array.isArray(data.questions)&&data.questions.length>0){setQuestions(data.questions);setAnswers([]);setStarted(false);setFinished(false);setQuestionSource('notion')}else{setQuestionSource('fallback')}}).catch(()=>{if(active)setQuestionSource('fallback')});return()=>{active=false}},[]);
 const index=answers.length;
 const analysis=useMemo(()=>{
  const scores=Object.fromEntries(vibes.map(v=>[v,0])) as Record<Vibe,number>;
  answers.forEach((choice,qi)=>{const q=questions[qi],opt=q?.options[choice];opt?.values.forEach((v,i)=>{if(v in scores)scores[v as Vibe]+=q.weight*(i===0?1:0.38)})});
  const ranking=[...vibes].sort((a,b)=>scores[b]-scores[a]||vibes.indexOf(a)-vibes.indexOf(b));
  const total=Object.values(scores).reduce((a,b)=>a+b,0)||1;
  const highlights=answers.map((choice,qi)=>({choice,qi,opt:questions[qi]?.options[choice]})).filter(x=>x.opt?.values.includes(ranking[0])).sort((a,b)=>questions[b.qi].weight-questions[a.qi].weight).slice(0,3).map(x=>x.opt.reason);
  return {ranking,scores,total,highlights};
 },[answers,questions]);
 const result=analysis.ranking;
 const matches=useMemo(()=>stores.filter(store=>store.styles.some(style=>aliases[result[0]].some(name=>normalized(style)===normalized(name)||normalized(style).includes(normalized(name))))&&(!city||store.city===city)),[stores,result,city]);
 const cities=[...new Set(stores.map(s=>s.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
 const restart=()=>{setAnswers([]);setStarted(false);setFinished(false);setCity('')};
 return <section id="vibe" className="vibeSection"><div className="vibeHeader"><div><span className="eyebrow">DISCOVER YOUR STYLE</span><h2>FIND YOUR <em>VIBE.</em></h2><p>{questions.length}개의 질문으로 나에게 어울리는 빈티지 스타일과 매장을 발견해 보세요.</p><small className="vibeDbStatus">{questionSource==='notion'?'노션 통합 DB와 연결됨':questionSource==='loading'?'노션 질문을 확인하는 중...':'노션 연결을 확인하지 못해 기본 질문으로 표시 중'}</small></div><Sparkles size={34} strokeWidth={1.3}/></div>
 {!started?<div className="vibeWelcome"><div><span>01 — {String(questions.length).padStart(2,'0')} / PERSONAL STYLE QUIZ</span><h3>당신의 빈티지 취향은?</h3><p>정답은 없어. 마음이 끌리는 선택지만 골라 줘.</p></div><button onClick={()=>setStarted(true)}>테스트 시작 <ArrowRight size={19}/></button></div>:
 !finished?<div className="vibePanel"><div className="vibeProgress"><span>QUESTION {String(index+1).padStart(2,'0')} / {String(questions.length).padStart(2,'0')}</span><div><i style={{width:`${index/questions.length*100}%`}}/></div></div><h3>{questions[index].title}</h3><p>{questions[index].hint}</p><div className="vibeOptions">{questions[index].options.map((opt,i)=><button key={i} onClick={()=>{setAnswers(prev=>[...prev,i]);if(index===questions.length-1)setFinished(true)}}><span>{String(i+1).padStart(2,'0')}</span>{opt.label}<ArrowUpRight size={17}/></button>)}</div><div className="vibeBottom"><button onClick={()=>setAnswers(prev=>prev.slice(0,-1))} disabled={index===0}><ArrowLeft size={15}/> 이전 질문</button><button onClick={restart}>처음부터</button></div></div>:
 <div className="vibeResult"><span className="eyebrow">YOUR VINTAGE DNA</span><h3>당신의 스타일은 <em>{result[0]}</em></h3><p>{about[result[0]]}</p><div className="vibeSub">함께 나타난 취향 <strong>{result[1]}</strong></div><div className="vibeExplain"><strong>이런 답변이 결과에 영향을 줬어요</strong><ul>{analysis.highlights.map((reason,i)=><li key={i}>{reason}</li>)}</ul><small>스타일 분류는 선택한 의류·실루엣·디테일에 가중치를 둔 취향 추천이며, 확정적인 성격 진단이나 객관적인 정확도 수치는 아니에요.</small></div><div className="vibeRankings">{result.slice(0,3).map((v,i)=><div key={v}><span>{i+1}. {v}</span><div><i style={{width:`${Math.round(analysis.scores[v]/(analysis.scores[result[0]]||1)*100)}%`}}/></div></div>)}</div><div className="vibeMatches"><div className="vibeMatchHeading"><div><span className="eyebrow">MATCHED STORES</span><h4>당신의 취향에 어울리는 매장</h4></div><select aria-label="추천 매장 지역 선택" value={city} onChange={e=>setCity(e.target.value)}><option value="">전국</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select></div>{matches.length?<div className="vibeStoreGrid">{matches.slice(0,6).map(s=><a key={s.id} href={`/stores/${encodeURIComponent(s.id)}`} target="_blank" rel="noopener noreferrer" className="vibeStore"><div><strong>{s.name}</strong><span><MapPin size={13}/>{[s.city,s.district].filter(Boolean).join(' · ')}</span></div><ArrowUpRight size={20}/></a>)}</div>:<p className="vibeNoStores">현재 선택한 지역에 이 스타일로 등록된 공개 매장이 없어요. 다른 지역을 선택해 보세요.</p>}</div><button className="vibeRestart" onClick={restart}><RotateCcw size={16}/> 다시 테스트하기</button></div>}
 </section>;
}
