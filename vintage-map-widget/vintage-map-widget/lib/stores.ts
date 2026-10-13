export type Store = {
  id: string; name: string; city: string; district: string; address: string;
  styles: string[]; items: string[]; hours: string; instagram: string;
  mapUrl: string; notionUrl: string; photo: string;
};
const rich = (prop: any): string => {
  if (!prop) return '';
  if (prop.type === 'title' || prop.type === 'rich_text') return (prop[prop.type] || []).map((x:any) => x.plain_text || x.text?.content || '').join('');
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'url') return prop.url || '';
  return '';
};
const multi = (prop: any): string[] => (prop?.multi_select || []).map((v:any)=>v.name);
export function asStore(page: any): Store {
  const p = page.properties || {};
  const photoFile = p['사진']?.files?.[0];
  const photo = photoFile?.file?.url || photoFile?.external?.url || '';
  return {
    id: page.id, name: rich(p['매장명']), city: rich(p['도시']), district: rich(p['지역']),
    address: rich(p['주소']), styles: multi(p['스타일']), items: multi(p['취급 품목']),
    hours: rich(p['운영시간']), instagram: rich(p['인스타그램']), mapUrl: rich(p['지도 URL']),
    notionUrl: page.url || '', photo
  };
}
const normalize = (s:string) => s.toLocaleLowerCase().replace(/\s+/g,'').normalize('NFC');
const cities = ['서울','부산','대구','대전','광주','수원','인천','제주','아산'];
const regionAliases: Record<string,string> = { '홍대':'마포', '연남':'마포', '연남동':'마포', '성수동':'성수', '행궁동':'수원', '전포동':'전포', '서면':'부산', '동묘':'서울' };
const normalizeStyle = (s:string) => normalize(s).replace(/archive/g,'아카이브').replace(/goth/g,'고스').replace(/punk/g,'펑크').replace(/grunge/g,'그런지');
export function searchStores(stores:Store[], term:string, city:string, style:string): Store[] {
  const words = term.trim().split(/\s+/).filter(Boolean).map(normalize);
  return stores.filter(s => {
    if(city && s.city !== city) return false;
    if(style && !s.styles.some(x => normalizeStyle(x) === normalizeStyle(style))) return false;
    const tokens = [s.name,s.city,s.district,s.address,...s.styles,...s.items].map(normalize);
    return words.every(w=> {
      const expanded = normalize(regionAliases[w]||'');
      return tokens.some(t=>t.includes(w) || (!!expanded && t.includes(expanded))) ||
        s.styles.some(t=>normalizeStyle(t).includes(normalizeStyle(w)));
    });
  });
}
export {cities};
