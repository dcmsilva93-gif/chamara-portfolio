import PortfolioPage from './portfolio';
import {defaults,Portfolio} from '@/lib/content';
import {supabase} from '@/lib/supabase';
export const revalidate=60;
export default async function Home(){let content:Portfolio=defaults;try{const client=supabase();if(client){const {data}=await client.from('portfolio_content').select('content').eq('id',1).maybeSingle();if(data?.content)content={...defaults,...data.content};}}catch{}return <PortfolioPage content={content}/>}
