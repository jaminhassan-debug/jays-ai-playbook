import { supabase } from "../lib/supabase";

export async function getServerSideProps() {
  // For gated content, check auth
  const { data } = await supabase
    .from("prompts")
    .select("*");

  return { props: { prompts: data } };
}

export default function Prompts({ prompts }) {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-text mb-8 text-center">Premium Prompts</h1>
      <p className="text-center mb-8">Access exclusive AI prompts for advanced users.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((p) => (
          <div key={p.id} className="bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text mb-2">{p.title}</h2>
            <p className="mb-4">{p.description}</p>
            <div className="bg-primary p-4 rounded">
              <pre className="text-sm">{p.content}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}