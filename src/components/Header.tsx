import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-50 bg-white mix-blend-difference text-black">
            <nav className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm md:text-base font-bold uppercase tracking-tight">
                <Link href="/" className="hover:underline decoration-2 decoration-[#ccff00]">
                    "HOME"
                </Link>
                <Link href="/about" className="hover:underline decoration-2 decoration-[#ccff00]">
                    "ABOUT"
                </Link>
                <Link href="/exhibition" className="hover:underline decoration-2 decoration-[#ccff00]">
                    "EXHIBITION"
                </Link>
                <Link href="/news" className="hover:underline decoration-2 decoration-[#ccff00]">
                    "NEWS"™
                </Link>
            </nav>
            <div className="text-sm md:text-base font-bold uppercase tracking-tight bg-black text-white px-1">
                "JOEY"™ c/o 2025
            </div>
        </header>
    );
}
