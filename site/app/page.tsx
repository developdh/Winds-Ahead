import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
export default async function Page(){const h=await headers();redirect(h.get('accept-language')?.toLowerCase().startsWith('ko')?'/ko':'/en')}
