export default function Marquee({ text }: { text: string }) {
    return (
        <div className="relative flex overflow-x-hidden border-b border-black py-2 bg-black text-white">
            <div className="animate-marquee whitespace-nowrap">
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
                <span className="mx-4 text-sm font-mono uppercase tracking-widest">{text}</span>
            </div>
        </div>
    );
}
