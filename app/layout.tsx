import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Chamara Maduranga Silva | Digital Strategy & Performance',description:'Digital strategy, performance marketing and innovation. Explore the experience, results and ideas of Chamara Maduranga Silva.',openGraph:{title:'Chamara Maduranga Silva',description:'Turning digital strategy into measurable business impact.',images:['/chamara-profile.jpg']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
