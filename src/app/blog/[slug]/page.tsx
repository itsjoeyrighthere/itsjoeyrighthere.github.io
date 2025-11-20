import { getAllPostIds, getPostData } from "@/lib/posts";

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths;
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <article className="w-full max-w-3xl mx-auto">
            <header className="mb-12 border-b border-black pb-8">
                <h1 className="text-4xl md:text-6xl font-bold uppercase mb-4 leading-tight">
                    {postData.title}
                </h1>
                <div className="flex justify-between items-center font-mono text-sm md:text-base">
                    <time>{postData.date}</time>
                    <span>"READING"</span>
                </div>
            </header>

            <div
                className="prose prose-xl prose-neutral max-w-none font-serif
        prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight
        prose-p:leading-relaxed prose-a:text-black prose-a:underline hover:prose-a:no-underline
        prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
            />

            <div className="mt-16 pt-8 border-t border-black text-center">
                <a href="/" className="text-lg font-bold uppercase hover:underline">
                    ← Back to Index
                </a>
            </div>
        </article>
    );
}
