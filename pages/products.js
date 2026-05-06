import { supabase } from "../lib/supabase";
import Link from 'next/link';

export async function getServerSideProps() {
  const { data } = await supabase
    .from("products")
    .select("*");

  return { props: { products: data } };
}

export default function Products({ products }) {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold text-text mb-8 text-center">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-text mb-2">{p.name}</h2>
            <p className="mb-4">{p.description}</p>
            <p className="text-xl font-bold mb-4">${p.price}</p>
            <button className="bg-accent px-4 py-2 rounded text-white hover:bg-text">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}