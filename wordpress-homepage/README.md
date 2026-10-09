# Jay's AI Playbook: WordPress homepage

The homepage on jaysaiplaybook.blog loads `jap-site.js` from this folder (via jsDelivr, pinned to a commit).
It injects the page's styles and markup into two placeholders on the WordPress page, `#jap-top` and `#jap-bottom`;
the newsletter signup between them is WordPress's own Subscribe block.

- Prompt Library: read live from Supabase (project `jays-ai-playbook`, table `public.prompts`, published rows only),
  with a built-in copy of the prompts as a fallback.
- The Oracle: builds plans from the Tool Vault in the browser. Live AI chat is marked "coming soon".
- Brand assets: `logo-*.svg`, `jap-*.svg`, `jap-app-icon.png`.

To update the page: edit, commit, then point the WordPress page's script tag at the new commit.

## Oracle Pro (locked prompts)

- Pro previews (title, area, story) come from `public.premium_prompts`, which anyone can read.
- The Pro prompt text lives only in Supabase, in `public.premium_prompt_bodies`, readable only by signed-in users with an active row in `public.members`. It is never stored in this repository.
- Members sign in with an emailed link (Supabase Auth). To give someone Pro access, add a row to `public.members` with their user id and `status = active`.
