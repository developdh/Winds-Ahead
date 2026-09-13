import {notFound} from 'next/navigation';
import SiteApp from '@/components/site-app';
import {findCosmetic,pageNames,type Locale,type View} from '@/lib/catalog';
type Props={params:Promise<{locale:string;slug?:string[]}>};
function resolve(locale:string,slug:string[]=[]){
 if(locale!=='en'&&locale!=='ko')return null;
 if(!slug.length)return {locale:locale as Locale,view:'catalog' as View};
 if(slug.length===2&&slug[0]==='cosmetics'&&findCosmetic(slug[1]))return {locale:locale as Locale,view:'detail' as View,itemId:slug[1]};
 if(slug.length===1&&['calendar','watchlist','updates','about'].includes(slug[0]))return {locale:locale as Locale,view:slug[0] as View};
 return null;
}
export async function generateMetadata({params}:Props){const {locale,slug}=await params;const route=resolve(locale,slug);if(!route)return {title:'Not found · Winds Ahead'};const item=route.itemId&&findCosmetic(route.itemId);const title=item?item.nameOriginal:pageNames[route.view as keyof typeof pageNames]?.[route.locale];return {title:`${title} · Winds Ahead / 연운경`,description:locale==='ko'?'공식 중국 자료로 살펴보는 연운 외관 도감. 글로벌 정보와 예상 일정을 구분해 확인하세요.':'Explore Where Winds Meet cosmetics with official CN sources, global status, and clearly separated forecasts.',alternates:{languages:{en:`/en/${(slug??[]).join('/')}`,ko:`/ko/${(slug??[]).join('/')}`}}}}
export default async function Page({params}:Props){const {locale,slug}=await params;const route=resolve(locale,slug);if(!route)notFound();return <SiteApp {...route}/>}
