'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Marquee from './Marquee';

interface Post {
    id: string;
    date: string;
    title: string;
    description?: string;
    contentHtml?: string;
    category?: string;
}

export default function Desktop({ posts }: { posts: Post[] }) {
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [zIndices, setZIndices] = useState<Record<string, number>>({});
    const [topZ, setTopZ] = useState(10);
    const [isMobile, setIsMobile] = useState(false);
    const [clickPositions, setClickPositions] = useState<Record<string, { x: number; y: number }>>({});

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleOpenPost = (id: string, event: React.MouseEvent) => {
        // Capture click position relative to viewport
        const clickX = event.clientX;
        const clickY = event.clientY;

        if (!openWindows.includes(id)) {
            setClickPositions(prev => ({ ...prev, [id]: { x: clickX, y: clickY } }));
            setOpenWindows([...openWindows, id]);
            bringToFront(id);
        } else {
            bringToFront(id);
        }
    };

    const handleClosePost = (id: string) => {
        setOpenWindows(openWindows.filter((w) => w !== id));
    };

    const bringToFront = (id: string) => {
        setTopZ(prev => prev + 1);
        setZIndices(prev => ({ ...prev, [id]: prev[id] === topZ + 1 ? prev[id] : topZ + 1 }));
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#f0f0f0] cursor-default select-none font-sans">
            {/* Background Grid Pattern with Engraved Effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundColor: '#f5f5f5',
                    backgroundImage: `
            radial-gradient(circle at center, transparent 0%, #f5f5f5 70%),
            radial-gradient(circle at center, rgba(0,0,0,0.15) 3px, transparent 4px)
          `,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '30px 30px'
                }}
            >
                {/* Overlay for "Hole" depth */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 1.5px, transparent 1.5px)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '31px 31px' // Offset for highlight
                }} />
            </div>

            {/* Scrollable Content Area for Desktop Icons */}
            <div className="absolute inset-0 overflow-y-auto pt-14 pb-20">

                {/* Hero Section */}
                <div className="mb-12">
                    <Marquee />
                    <div className="text-center mt-16 mb-8">
                        <h1 className="text-[80px] md:text-[120px] font-bold leading-none tracking-tighter text-white text-stroke-black">
                            JOEY
                        </h1>
                        <div className="inline-block bg-[#ccff00] px-4 py-1 transform -rotate-2">
                            <span className="font-mono font-bold text-xl md:text-2xl tracking-widest">"ARCHIVE" C/O 2025</span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-black max-w-6xl mx-auto" />
                </div>

                {/* Desktop Icons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 md:px-8 pb-20">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex flex-col group cursor-pointer bg-white border border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(204,255,0,1)] transition-all duration-200 hover:-translate-y-1"
                            onClick={(e) => handleOpenPost(post.id, e)}
                        >
                            <div className="flex justify-between items-start mb-4 border-b border-black pb-2">
                                <span className="font-mono text-xs text-gray-500">[REF: {post.id.substring(0, 4).toUpperCase()}]</span>
                                <span className="font-mono text-xs bg-black text-white px-1 uppercase">{post.category || 'ESSAY'}</span>
                            </div>

                            <h2 className="text-3xl font-bold uppercase leading-tight mb-4 line-clamp-3 group-hover:italic transition-all">
                                "{post.title}"
                            </h2>

                            <div className="mt-auto pt-4 flex justify-between items-end">
                                <span className="font-mono text-xs bg-black text-white px-1">{post.date}</span>
                                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center group-hover:bg-[#ccff00] transition-colors">
                                    <span className="text-lg">↗</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Windows Layer */}
            {posts.map((post, index) => {
                if (!openWindows.includes(post.id)) return null;

                // Get click position for this window
                const clickPos = clickPositions[post.id] || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

                // Calculate small stagger offset for multiple windows
                const windowIndex = openWindows.indexOf(post.id);
                const smallOffsetX = windowIndex * 20;
                const smallOffsetY = windowIndex * 20;

                // Position window near click location with small offset
                // Ensure window stays within viewport bounds
                const windowWidth = isMobile ? window.innerWidth * 0.9 : 600;
                const windowHeight = isMobile ? window.innerHeight * 0.8 : Math.min(600, window.innerHeight * 0.8);

                let finalLeft = clickPos.x - windowWidth / 2 + smallOffsetX;
                let finalTop = clickPos.y - 100 + smallOffsetY; // Slightly above click point

                // Bounds checking
                finalLeft = Math.max(20, Math.min(finalLeft, window.innerWidth - windowWidth - 20));
                finalTop = Math.max(80, Math.min(finalTop, window.innerHeight - 200)); // Account for header

                return (
                    <motion.div
                        key={`window-${post.id}`}
                        drag={!isMobile}
                        dragMomentum={false}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bg-white border border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                        style={{
                            zIndex: zIndices[post.id] || 10,
                            top: finalTop,
                            left: finalLeft,
                            width: isMobile ? '90%' : '600px',
                            height: isMobile ? '80%' : 'auto',
                            maxHeight: '80vh',
                        }}
                        onMouseDown={() => bringToFront(post.id)}
                    >
                        {/* Window Header */}
                        <div className="bg-[#ccff00] text-black border-b border-black px-2 py-1 flex justify-between items-center cursor-move handle shrink-0">
                            <span className="font-mono text-xs uppercase truncate max-w-[80%] font-bold">
                                "{post.title}"
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleClosePost(post.id); }}
                                className="hover:bg-black hover:text-[#ccff00] px-2 font-bold"
                            >
                                X
                            </button>
                        </div>

                        {/* Window Content */}
                        <div className="p-6 overflow-y-auto font-serif text-base md:text-lg leading-relaxed flex-grow custom-scrollbar bg-white">
                            <div className="mb-4 pb-4 border-b border-black border-dashed">
                                <h1 className="text-3xl md:text-5xl font-bold uppercase mb-2 tracking-tighter">"{post.title}"</h1>
                                <p className="font-mono text-xs bg-black text-white inline-block px-1">DATE: {post.date}</p>
                            </div>
                            <div
                                className="prose prose-sm md:prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-p:text-black prose-a:text-blue-600 hover:prose-a:text-[#ccff00] hover:prose-a:bg-black"
                                dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
                            />
                        </div>
                        {/* Window Footer */}
                        <div className="bg-gray-100 border-t border-black p-1 flex justify-end items-center text-[10px] font-mono uppercase shrink-0">
                            <span>UTF-8</span>
                        </div>
                    </motion.div>
                );
            })}

            {/* System Status Overlay */}
            <div className="fixed bottom-4 right-4 font-mono text-xs bg-black text-white px-2 py-1 pointer-events-none z-50">
                WINDOWS: {openWindows.length}
            </div>
        </div >
    );
}
