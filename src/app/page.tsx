import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <section className="mb-24 text-center">
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-8">
          FIGURES OF SPEECH
        </h1>
        <p className="text-xl md:text-2xl font-mono uppercase tracking-widest">
          "Personal Blog"
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8">
        {allPostsData.map(({ id, date, title, description }) => (
          <Link
            key={id}
            href={`/blog/${id}`}
            className="group block border-t border-black pt-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-baseline">
              <h2 className="text-2xl md:text-4xl font-bold uppercase group-hover:italic">
                {title}
              </h2>
              <span className="font-mono text-sm">{date}</span>
            </div>
            <p className="mt-2 text-lg text-gray-600 font-serif">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
