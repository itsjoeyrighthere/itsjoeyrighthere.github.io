import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import Marquee from "@/components/Marquee";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="w-full">
      <Marquee text='"JOEY"™ c/o 2025 "FIGURES OF SPEECH" [ARCHIVE] — ' />

      <div className="max-w-6xl mx-auto px-4 mt-12 md:mt-24">
        <section className="mb-12 md:mb-24 text-center border-b border-black pb-12">
          <h1 className="text-8xl md:text-[10rem] font-bold tracking-tighter leading-[0.8] mb-4 text-stroke text-transparent hover:text-black transition-colors cursor-default">
            JOEY
          </h1>
          <div className="inline-block bg-[#ccff00] px-4 py-1 transform -rotate-2">
            <p className="text-xl md:text-2xl font-mono uppercase tracking-widest text-black font-bold">
              "ARCHIVE" c/o 2025
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {allPostsData.map(({ id, date, title, description }) => (
            <Link
              key={id}
              href={`/blog/${id}`}
              className="group block border border-black p-4 hover:bg-[#ccff00] transition-colors relative h-64 flex flex-col justify-between"
            >
              <div className="absolute top-2 right-2 font-mono text-xs opacity-50 group-hover:opacity-100">
                [REF: {id.substring(0, 4).toUpperCase()}]
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold uppercase leading-none mb-2 group-hover:italic">
                  "{title}"™
                </h2>
                <span className="font-mono text-xs bg-black text-white px-1 group-hover:bg-white group-hover:text-black">
                  {date}
                </span>
              </div>

              <div className="mt-4 border-t border-black pt-2">
                <p className="text-sm font-mono uppercase tracking-tight line-clamp-3">
                  {description}
                </p>
                <div className="mt-2 text-xs font-bold uppercase hidden group-hover:block">
                  [SEE MORE]
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
