import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-50 bg-white mix-blend-difference text-black">
            <nav className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm md:text-base font-bold uppercase tracking-tight">
                <Link href="/" className="hover:underline">
                    Home
                </Link>
                <Link href="/about" className="hover:underline">
                    About
                </Link>
                <Link href="/archive" className="hover:underline">
                    Archive
                </Link>
            </nav>
            <div className="text-sm md:text-base font-bold uppercase tracking-tight">
                Personal Blog
            </div>
        </header>
    );
}
