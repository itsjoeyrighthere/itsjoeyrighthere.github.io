export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-between items-end z-50 pointer-events-none">
            <div className="text-xs md:text-sm font-mono pointer-events-auto">
                © {new Date().getFullYear()}
            </div>
            <div className="text-xs md:text-sm font-mono pointer-events-auto">
                SCROLL TO EXPLORE
            </div>
        </footer>
    );
}
