import type { ReactNode } from 'react';
export default function PageHero({eyebrow,title,children}:{eyebrow:string;title:string;children:ReactNode}){return <section className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{children}</p></section>}
