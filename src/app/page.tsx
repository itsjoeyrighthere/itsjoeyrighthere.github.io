import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import Marquee from "@/components/Marquee";
import Desktop from "@/components/Desktop";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="w-full h-screen overflow-hidden">
      <Desktop posts={allPostsData} />
    </div>
  );
}
