'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface Post {
    id: string;
    date: string;
    title: string;
    description?: string;
    contentHtml?: string; // Added for window content
}

export default function InfiniteCanvas({ posts }: { posts: Post[] }) {
    const constraintsRef = useRef(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [zIndices, setZIndices] = useState<Record<string, number>>({});
    const [topZ, setTopZ] = useState(10);

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    const handleOpenPost = (id: string) => {
        if (!openWindows.includes(id)) {
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

    // Deterministic positioning based on hash of string
    const getPosition = (id: string, index: number) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const x = (hash * 137) % 2000 - 1000 + (index * 100);
        const y = (hash * 293) % 2000 - 1000 + (index * 50);
        return { x, y };
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#f0f0f0] cursor-crosshair">
            {/* Desktop Icons Layer */}
            <motion.div
                ref={constraintsRef}
                className="absolute inset-0"
                style={{ width: '100%', height: '100%' }}
            >
                <motion.div
                    drag
                    dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
                    className="absolute left-1/2 top-1/2 w-[4000px] h-[4000px] bg-white origin-center"
                    style={{
                        x: -2000,
                        y: -2000,
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                >
                    <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-black -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-1/2 mt-4 -translate-x-1/2 font-mono text-xs">
                        SYSTEM ROOT (0,0)
                    </div>

                    {posts.map((post, index) => {
                        const { x, y } = getPosition(post.id, index);
                        return (
                            <motion.div
                                key={post.id}
                                className="absolute w-64 bg-transparent hover:bg-gray-100 p-2 border border-transparent hover:border-black transition-colors cursor-pointer group"
                                style={{
                                    left: `calc(50% + ${x}px)`,
                                    top: `calc(50% + ${y}px)`
                                }}
                                onClick={() => handleOpenPost(post.id)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-full aspect-square bg-black flex items-center justify-center text-white font-mono text-4xl mb-2 group-hover:bg-[#ccff00] group-hover:text-black">
                                    {post.title.charAt(0)}
                                </div>
                                <div className="font-mono text-xs uppercase truncate font-bold">
                                    {post.title}
                                </div>
                                <div className="font-mono text-[10px] text-gray-500">
                                    {post.date}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>

            {/* Windows Layer (Fixed on screen, but draggable) */}
            {posts.map((post) => {
                if (!openWindows.includes(post.id)) return null;
                return (
                    <motion.div
                        key={`window-${post.id}`}
                        drag
                        dragMomentum={false}
                        initial={{ scale: 0.9, opacity: 0, x: 100, y: 100 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute w-[500px] max-w-[90vw] bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                        style={{
                            zIndex: zIndices[post.id] || 10,
                            top: '20%',
                            left: '20%',
                            maxHeight: '60vh'
                        }}
                        onMouseDown={() => bringToFront(post.id)}
                    >
                        {/* Window Header */}
                        <div className="bg-black text-white px-2 py-1 flex justify-between items-center cursor-move handle">
                            <span className="font-mono text-xs uppercase truncate">
                                {post.title} — [READ-ONLY]
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleClosePost(post.id); }}
                                className="hover:text-[#ccff00] font-mono text-xs"
                            >
                                [X]
                            </button>
                        </div>

                        {/* Window Content */}
                        <div className="p-6 overflow-y-auto font-serif text-lg leading-relaxed flex-grow custom-scrollbar">
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <h1 className="text-3xl font-bold uppercase mb-2">{post.title}</h1>
                                <p className="font-mono text-xs text-gray-500">{post.date}</p>
                            </div>
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
                            />
                        </div>

                        {/* Window Footer */}
                        <div className="bg-gray-100 border-t border-black p-1 flex justify-between items-center text-[10px] font-mono uppercase">
                            <span>Ln 1, Col 1</span>
                            <span>UTF-8</span>
                        </div>
                    </motion.div>
                );
            })}

            {/* Overlay UI */}
            <div className="fixed bottom-4 right-4 font-mono text-xs bg-black text-white px-2 py-1 pointer-events-none z-50">
                WINDOWS: {openWindows.length}
            </div>
        </div>
    );
}
