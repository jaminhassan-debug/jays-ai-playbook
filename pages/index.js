import { supabase } from "../lib/supabase";
import Link from 'next/link';

export async function getServerSideProps() {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return { props: { articles: data } };
}

export default function Home({ articles }) {
  return (
    <div className="text-white">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-text mb-4">Jay's AI Playbook</h1>
        <p className="text-xl mb-8">Master AI with proven strategies and tools</p>
        <Link href="/products" className="bg-accent px-6 py-3 rounded text-white hover:bg-text">
          Explore Products
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div key={a.id} className="bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text mb-2">{a.title}</h2>
            <p className="mb-4">{a.excerpt}</p>
            <Link href={`/post/${a.slug}`} className="text-accent hover:text-text">
              Read More →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}