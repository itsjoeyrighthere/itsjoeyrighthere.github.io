'use client';

import { useState, useEffect } from 'react';

export default function Marquee() {
    const [displayTexts, setDisplayTexts] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();

        const texts = [
            `OVERTHINKING EVERYTHING`,
            `JOEY'S BRAIN DUMP`,
            `SCROLL AT YOUR OWN RISK`,
            `JUST THOUGHTS`,
            `NOTHING SPECIAL`,
            `JOEY ${currentYear}`,
            `PROCRASTINATING IN STYLE`,
            `RANDOM MUSINGS`,
            `WELCOME TO THE CHAOS`,
            `WHATEVER COMES TO MIND`,
            `NO FILTER`,
            `PROBABLY OVERTHINKING IT`,
            `BRAIN.EXE RUNNING`,
            `THOUGHTS ON LOOP`,
            `CTRL+ALT+DELETE TO EXIT`,
            `IDK JUST VIBING`,
            `SOME STUFF I WROTE`,
            `JOEY'S CORNER`
        ];

        // Shuffle the texts array
        const shuffled = [...texts].sort(() => Math.random() - 0.5);
        // Duplicate for seamless loop
        setDisplayTexts([...shuffled, ...shuffled]);
    }, []);

    if (displayTexts.length === 0) return null;

    return (
        <div className="bg-[#ccff00] text-black py-2 overflow-hidden border-b border-black relative">
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
                backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.15) 3px, transparent 4px)`,
                backgroundSize: '60px 60px',
                backgroundPosition: '30px 30px'
            }} />

            <div className="flex animate-marquee-infinite whitespace-nowrap font-bold text-sm font-mono uppercase tracking-widest text-[#ff6600]">
                {displayTexts.map((text, index) => (
                    <span key={index} className="mx-4">— {text} —</span>
                ))}
            </div>
        </div>
    );
}
