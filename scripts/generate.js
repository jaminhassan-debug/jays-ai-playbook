#!/usr/bin/env node

// Script to generate and save articles to Supabase
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function generateArticle() {
  // Your AI generation logic here
  const post = {
    title: "Sample AI Article",
    slug: "sample-ai-article",
    content: "<p>This is generated content.</p>",
    summary: "A summary of the article."
  };

  // Save to Supabase
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.summary,
      category: "playbooks",
      status: "published",
      published_at: new Date()
    })
  });

  if (response.ok) {
    console.log('Article saved successfully');
  } else {
    console.error('Failed to save article');
  }
}

generateArticle();