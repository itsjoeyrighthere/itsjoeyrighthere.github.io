export default function Marquee({ text }: { text: string }) {
    return (
        <div className="bg-[#ccff00] text-black py-2 overflow-hidden border-b border-black relative">
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.15) 3px, transparent 4px)`,
                backgroundSize: '60px 60px',
                backgroundPosition: '30px 30px'
            }} />

            <div className="animate-marquee whitespace-nowrap font-bold text-sm font-mono uppercase tracking-widest text-[#ff6600]">
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
                <span className="mx-4">{text}</span>
            </div>
        </div>
    );
}
