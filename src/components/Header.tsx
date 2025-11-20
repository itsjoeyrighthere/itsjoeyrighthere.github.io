import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 flex flex-col mix-blend-difference">
            {/* Top Bar with Tabs */}
            <div className="flex w-full border-b border-black bg-white text-black h-12 md:h-14 items-stretch">
                {/* Status/Extra Tab (Left) */}
                <div className="hidden md:flex items-center px-4 border-r border-black bg-white">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black"></div>
                        <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black"></div>
                        <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black"></div>
                    </div>
                </div>

                {/* Navigation Tabs (Center) */}
                <nav className="flex-1 flex overflow-x-auto no-scrollbar">
                    <Link href="/" className="flex items-center px-6 border-r border-black hover:bg-[#f0f0f0] whitespace-nowrap font-bold uppercase text-sm md:text-base relative group">
                        <span>"HOME"</span>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e0e0e0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] opacity-50 group-hover:opacity-100"></div>
                    </Link>
                    <Link href="/about" className="flex items-center px-6 border-r border-black hover:bg-[#f0f0f0] whitespace-nowrap font-bold uppercase text-sm md:text-base relative group">
                        <span>"ABOUT"</span>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e0e0e0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] opacity-50 group-hover:opacity-100"></div>
                    </Link>
                    <Link href="/exhibition" className="flex items-center px-6 border-r border-black hover:bg-[#f0f0f0] whitespace-nowrap font-bold uppercase text-sm md:text-base relative group">
                        <span>"EXHIBITION"</span>
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e0e0e0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] opacity-50 group-hover:opacity-100"></div>
                    </Link>
                </nav>

                {/* Branding Tab (Right) */}
                <div className="flex items-center px-3 border-l border-black justify-between bg-white relative">
                    <span className="font-bold text-xs md:text-sm tracking-wide">"ITSJOEYRIGHTHERE"</span>
                    <div className="w-3 h-3 rounded-full bg-[#e0e0e0] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] ml-3"></div>
                </div>
            </div>
        </header>
    );
}
