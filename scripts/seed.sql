-- Seed Products Table
INSERT INTO products (name, description, price, category) VALUES
  ('AI Writing Prompts Pack', 'Advanced prompts for content creation', 29.99, 'prompts'),
  ('ChatGPT Master Course', 'Complete guide to ChatGPT for professionals', 99.99, 'courses'),
  ('Prompt Engineering Playbook', 'Step-by-step guide to create perfect prompts', 49.99, 'playbooks'),
  ('AI Automation Template Pack', 'Ready-to-use automation workflows', 39.99, 'templates');

-- Seed Prompts Table
INSERT INTO prompts (title, description, content, category) VALUES
  (
    'Advanced Content Creation',
    'Create viral-worthy content for social media',
    'You are an expert content creator. Write compelling social media posts that drive engagement. Include: Hook (first line), Body (main message), CTA (call-to-action). Make it platform-specific and current.',
    'content'
  ),
  (
    'Deep Research Assistant',
    'Comprehensive research for any topic',
    'You are a research expert. For the given topic:
1. Find the most relevant and recent information
2. Identify key facts and statistics
3. Summarize in a digestible format
4. Provide reliable sources
5. Include counterarguments if applicable',
    'research'
  ),
  (
    'Email Campaign Writer',
    'Write high-converting email sequences',
    'You are an email marketing expert. Write a 5-email sequence for [PRODUCT]:
- Email 1: Hook (pain point)
- Email 2: Proof (social proof)
- Email 3: Bridge (benefits)
- Email 4: Urgency (scarcity)
- Email 5: CTA (conversion)
Make each compelling and unique.',
    'marketing'
  ),
  (
    'Product Launch Strategy',
    'Complete product launch playbook',
    'You are a product strategist. For [PRODUCT], create a 30-day launch plan:
- Week 1: Build audience
- Week 2: Build hype
- Week 3: Early access
- Week 4: Full launch
Include specific tactics, content, and metrics for each phase.',
    'strategy'
  ),
  (
    'SEO Content Optimizer',
    'Optimize content for search engines',
    'You are an SEO specialist. Analyze this content and:
1. Identify primary keyword
2. Add LSI keywords naturally
3. Optimize headline for CTR
4. Improve meta description
5. Add internal linking suggestions
6. Ensure readability score is 70+',
    'seo'
  );

-- Seed Email Subscribers Table (optional - for subscribers)
-- INSERT INTO email_subscribers (email) VALUES
--   ('subscriber@example.com');

-- Seed Articles Table (sample)
INSERT INTO articles (title, slug, content, excerpt, category, status, published_at) VALUES
  (
    'The Complete Guide to Prompt Engineering',
    'complete-guide-prompt-engineering',
    '<h2>Master the Art of Prompts</h2><p>Prompt engineering is the key to unlocking the full potential of AI models like ChatGPT, Claude, and GPT-4. Learn the techniques that top companies use to get 10x better results from AI.</p><h3>Key Strategies</h3><ul><li>Be specific and detailed</li><li>Provide context</li><li>Use examples</li><li>Request step-by-step thinking</li></ul>',
    'Discover how to write prompts that get you results 10x faster',
    'playbooks',
    'published',
    NOW()
  ),
  (
    'AI Tools 2024: The Complete Stack',
    'ai-tools-2024-complete-stack',
    '<h2>Your AI Toolkit</h2><p>Here is the complete stack of AI tools you need in 2024 to stay competitive.</p><h3>Essential Tools</h3><ul><li><strong>Writing:</strong> Claude, ChatGPT</li><li><strong>Design:</strong> Midjourney, DALL-E</li><li><strong>Automation:</strong> Zapier, Make</li><li><strong>Analytics:</strong> Mixpanel, Amplitude</li></ul>',
    'The definitive guide to AI tools that actually work',
    'playbooks',
    'published',
    NOW()
  ),
  (
    'How to Build a $100K AI Business in 90 Days',
    'build-100k-ai-business-90-days',
    '<h2>Your AI Business Blueprint</h2><p>Follow this framework to launch a profitable AI business quickly.</p><h3>The 3-Phase Framework</h3><p><strong>Phase 1 (Days 1-30):</strong> Validate idea and build audience</p><p><strong>Phase 2 (Days 31-60):</strong> Create products and optimize</p><p><strong>Phase 3 (Days 61-90):</strong> Scale and automate</p>',
    'The step-by-step playbook for AI founders',
    'playbooks',
    'published',
    NOW()
  );