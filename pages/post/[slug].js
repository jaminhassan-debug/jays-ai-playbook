import { supabase } from "../../lib/supabase";
import Link from 'next/link';

export async function getServerSideProps({ params }) {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .single();

  return { props: { article: data } };
}

export default function Post({ article }) {
  if (!article) return <div className="text-white">Article not found</div>;

  return (
    <div className="text-white max-w-4xl mx-auto">
      <Link href="/" className="text-accent hover:text-text mb-4 inline-block">← Back to Home</Link>
      <h1 className="text-4xl font-bold text-text mb-4">{article.title}</h1>
      <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}