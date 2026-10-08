-- Run in Supabase: project jays-ai-playbook > SQL Editor. Safe to run more than once.
update public.prompts set job = 'Hiring & team' where job = 'Hiring';
update public.prompts set story = $q$I've run an online clothing brand since 2017, so I know how much writing even a small shop needs. Shoppers can't touch or try on what's on a screen, so the words have to do the work. This prompt writes a product page from the few facts you already have.$q$ where slug = 'ecommerce-product-descriptions';
update public.prompts set story = $q$I ran two restaurants before any of this existed, so this one's close to my heart. The specials change every week, and so do the chalkboard, the Instagram post and the Google update. List the dishes and this prompt writes the lot, so you can get back to the kitchen.$q$ where slug = 'cafe-weekly-specials';
update public.prompts set story = $q$Since 2017 I have juggled a full-time business development job with running my own brand, so I know how easy it is to spend a whole week reacting. This is a Monday-morning habit: dump everything on your mind, and it hands back what actually matters, what to hand off or automate, and what you can drop without guilt.$q$ where slug = 'monday-ceo-hour';
insert into public.prompts (slug,title,industry,job,story,time_saved,tools,prompt,sort_order) values
($q$calm-complaint-replies$q$,$q$Turn an angry complaint into a loyal customer$q$,$q$Any business$q$,$q$Customer service$q$,$q$Every owner knows the stomach-drop of a furious email at 10pm. Reply too fast and it gets worse; leave it and it festers. This prompt helps you answer calmly, own what went wrong, and fix it, so the customer leaves happier than before the problem happened.$q$,$q$1–2 hrs a week, and a lot of stress$q$,$q$Claude or ChatGPT$q$,$q$A customer has complained. Here's their message:
[paste complaint]

What actually happened, from our side: [the facts]
What I can offer to put it right: [e.g. refund, redo, discount, nothing extra]
My business: [name and type]

Write a reply that:
1. Thanks them for telling us and shows I've understood exactly what upset them
2. Owns any mistake plainly, without grovelling or making excuses
3. Explains what I'll do to fix it and by when
4. Ends warmly, with my name and a direct way to reach me

Keep it under 150 words. Calm, human, British. If they're partly in the wrong, stay kind and don't argue the point. Then give me a shorter version I could send as a text.$q$,160),
($q$website-faq-page$q$,$q$An FAQ page that answers questions before they're asked$q$,$q$Any business$q$,$q$Customer service$q$,$q$If you answer the same ten questions every week, your customers are telling you what your website is missing. Write them down once, and this prompt turns them into a clear FAQ page you can also load into a website chat tool.$q$,$q$2–4 hrs a week of repeat questions$q$,$q$Claude or ChatGPT, then your website or a chat tool like Tidio$q$,$q$I run [business name], a [type of business] in [area]. Here are the questions customers ask me most, roughly in my words:
[list 10–20 questions, plus how you usually answer]
Key facts: prices [ ], opening hours [ ], delivery or service area [ ], returns or cancellation policy [ ], how to book or buy [ ].

Write an FAQ page:
1. Group the questions under 3–5 clear headings
2. Answer each in under 60 words, friendly and plain
3. Add 5 questions customers probably wonder about but don't ask
4. Finish with a short line on how to get in touch for anything else

Only use facts I've given you. Mark anything you're unsure of with [CHECK].$q$,170),
($q$new-customer-welcome$q$,$q$Welcome new customers so they feel looked after from day one$q$,$q$Gyms & coaching$q$,$q$Customer service$q$,$q$Picture Kev, who runs a boxing gym. New members sign up full of energy, then half of them drift away by week three because nobody checked in. A short welcome sequence does the checking in for him, so every new face feels noticed.$q$,$q$About 2 hrs a week$q$,$q$ChatGPT or Claude, then your email or booking system$q$,$q$I run [business name] for [type of customer]. When someone new signs up or buys, they get: [what happens next]. The things new customers usually worry about or get wrong: [list].

Write a welcome sequence:
1. Day 0: a warm welcome with exactly what happens next
2. Day 2: one simple tip to get the most out of us
3. Day 7: a friendly check-in asking how it's going, with an easy way to reply
4. Day 21: a short note celebrating their progress, plus one next step

Each under 100 words, written like a person, not a company. Give 2 subject line options for each, and a text-message version of the day 7 check-in.$q$,180),
($q$quote-follow-up$q$,$q$Follow up on a quote without feeling pushy$q$,$q$Trades & home services$q$,$q$Sales$q$,$q$Most quotes aren't turned down; they're forgotten. The customer meant to reply, then life happened. A friendly nudge isn't pushy, it's helpful. This prompt writes follow-ups that feel like good service, not a sales chase.$q$,$q$1–2 hrs a week, plus more jobs won$q$,$q$ChatGPT or Claude$q$,$q$I sent a quote and haven't heard back.
Customer: [name]
Job: [what it was for]
Quote: £[amount], sent on [date]
Anything they mentioned that mattered to them: [e.g. timing, budget, worried about mess]

Write 3 short follow-ups:
1. After 3 days: a friendly check they received it, with an offer to answer questions
2. After 7 days: something genuinely useful, like a tip or my next available dates
3. After 14 days: a polite close-the-loop message that makes it easy to say "not right now"

Each under 80 words, suitable for text or email. Warm, relaxed, zero pressure, no fake deadlines.$q$,190),
($q$human-cold-outreach$q$,$q$Outreach messages that sound like a real person$q$,$q$Consultants & agencies$q$,$q$Sales$q$,$q$I spent 14 years in business development, and the messages that got replies were short, specific and about the other person. This prompt helps you write that kind of message, the kind you'd be happy to receive yourself.$q$,$q$2–3 hrs a week$q$,$q$Claude or ChatGPT, then LinkedIn or email$q$,$q$I want to reach out to [type of person or business] about [what you offer].
Who I am: [one line]
Why them specifically: [something real you noticed about them]
A result I can honestly point to: [example, or "none yet"]

Write:
1. A first message under 80 words that leads with them, not me, and ends with an easy, low-pressure question
2. A follow-up for a week later that adds something useful rather than "just bumping this"
3. 3 subject lines for email, and a 300-character version for a LinkedIn connection request

No flattery, no hype, no fake familiarity. If my reason for contacting them is weak, tell me.$q$,200),
($q$tasteful-promotion$q$,$q$Plan a promotion that doesn't cheapen your brand$q$,$q$E-commerce$q$,$q$Marketing$q$,$q$Picture Hannah, who sells jewellery online. Every time sales dip, she reaches for 20% off, and her customers have learned to wait for it. This prompt plans promotions that give people a reason to buy now without training them to expect a discount.$q$,$q$3–4 hrs per campaign$q$,$q$Claude or ChatGPT, then your email tool and Canva$q$,$q$I sell [products] to [customers]. My average order is about £[amount]. Reason for a promotion: [e.g. new collection, quiet month, clear old stock, anniversary].
Things I'm happy to offer: [e.g. gift with purchase, bundle, free delivery, early access, small discount]

Give me 3 promotion ideas that protect my brand. For each:
1. The offer and why it suits my brand
2. Who it's for (new customers, past customers, VIPs)
3. A simple timeline: announce, remind, last chance
4. An email subject line and a social caption
5. What to measure to know if it worked

Avoid fake scarcity or countdown tricks. Tell me which idea you'd pick and why.$q$,210),
($q$faq-to-blog-posts$q$,$q$Turn customer questions into a month of blog posts$q$,$q$Any business$q$,$q$Content$q$,$q$The questions your customers ask are exactly what other people are typing into Google. Answer them properly on your website and you'll be found by people who've never heard of you. This prompt turns your everyday questions into a month of useful posts.$q$,$q$4–6 hrs a month$q$,$q$Claude or ChatGPT, then your website$q$,$q$I run [business], a [type] in [area]. Here are questions customers often ask me:
[list 8–12 questions]

1. Pick the 4 most useful to answer as blog posts, and say why
2. For each, give a clear title that matches how people search, and a 155-character meta description
3. Write the first post in full: 600–800 words, plain English, with subheadings, one real example from my kind of business, and a gentle line at the end about how I can help
4. Outline the other 3 with subheadings and key points

Use British spelling. Don't invent facts, prices or statistics; mark gaps with [CHECK].$q$,220),
($q$about-page-that-builds-trust$q$,$q$An About page that makes people trust you$q$,$q$Any business$q$,$q$Content$q$,$q$Your About page is usually the second page people visit. They're not checking your history; they're asking, "Is this a real person I can trust?" This prompt helps you tell your story honestly, so the right customers feel they already know you.$q$,$q$2–3 hrs$q$,$q$Claude or ChatGPT$q$,$q$Help me write the About page for [business name]. Here's my story, in no particular order:
- How and why I started: [ ]
- What I did before: [ ]
- A moment that shaped how I work: [ ]
- Who I help and what I help them with: [ ]
- What I care about and won't compromise on: [ ]
- Something human about me: [e.g. family, hobby, where I'm from]

Write a 300–400 word About page in the first person. Start with the customer's problem, not my CV. Show my story through one or two specific moments. Finish with a friendly, no-pressure invitation to get in touch.

Keep my own phrases where they're good. Don't add achievements or details I haven't given you.$q$,230),
($q$phone-video-scripts$q$,$q$Short video scripts you can film on your phone today$q$,$q$Any local business$q$,$q$Content$q$,$q$Most owners know they should be on video, then freeze when the camera's on. A simple script with a strong first line changes that. This prompt gives you five short videos you can film on your phone in one go, no studio and no dancing.$q$,$q$3–4 hrs a week$q$,$q$ChatGPT or Claude, then CapCut$q$,$q$I run [business] for [ideal customer] in [area]. Things I know that customers find useful or surprising: [list 3–5]. A common mistake people make that I can help with: [ ].

Write 5 short video scripts, 30–45 seconds each. For each give:
1. A hook for the first 2 seconds, said to camera
2. The script, in short spoken sentences
3. What to show on screen (simple, filmable on a phone)
4. The caption and on-screen text
5. One soft call to action

Mix: one tip, one myth-buster, one behind-the-scenes, one customer question, one "day in the life". Make it sound like me chatting, not an advert.$q$,240),
($q$inbox-zero-triage$q$,$q$Clear your inbox in 20 minutes$q$,$q$Any business$q$,$q$Admin$q$,$q$An overflowing inbox isn't a time problem, it's a decisions problem: every email asks you to decide something. Paste in the backlog and this prompt sorts it, drafts the replies, and tells you which few actually need you.$q$,$q$3–5 hrs a week$q$,$q$Claude or ChatGPT (or the AI built into Gmail or Outlook)$q$,$q$Here are the emails waiting in my inbox (sender, subject and the key text):
[paste emails, removing anything sensitive]

I run [business]. My priorities this week: [ ].

Sort them into:
1. Needs me today: what decision each one needs, in one line
2. Can be answered now: draft a short reply for each, in a friendly, direct voice
3. Delegate: who it should go to [team members or "just me"] and a one-line handover note
4. Archive or unsubscribe: list them

Keep every draft reply under 80 words. Flag anything that looks like a scam or needs care.$q$,250),
($q$meeting-notes-to-actions$q$,$q$Turn meeting notes into actions, owners and dates$q$,$q$Any business$q$,$q$Admin$q$,$q$Lots of meetings end with everyone nodding and nothing happening. The fix is boring but powerful: a clear list of who's doing what by when, sent the same day. This prompt turns a messy transcript into exactly that.$q$,$q$1–2 hrs a week$q$,$q$Otter.ai or your call recorder, then Claude$q$,$q$Here are the notes or transcript from a meeting:
[paste]

People in the meeting: [names and roles]

Give me:
1. A 3-sentence summary of what was decided
2. A table of actions: action, owner, deadline (suggest one if none was set, marked "suggested")
3. Open questions nobody answered
4. A short, friendly follow-up email to everyone with the summary and actions

Only include decisions and actions that were actually said. If an action has no clear owner, flag it rather than guessing.$q$,260),
($q$repeatable-checklist$q$,$q$A checklist for anything you do more than once$q$,$q$Any business$q$,$q$Admin$q$,$q$Pilots use checklists not because they forget how to fly, but because busy people skip steps. Opening up, closing down, packing an order, launching a product: anything you repeat deserves a checklist so it's done right, even on a bad day.$q$,$q$1–3 hrs a week of mistakes and re-dos$q$,$q$Claude or ChatGPT, then Notion$q$,$q$I want a checklist for this task: [task, e.g. closing the shop, sending out an order, onboarding a client].
How I do it now, roughly: [describe or paste notes]
Things that have gone wrong before: [list]

Create:
1. A checklist grouped into before, during and after, one action per line
2. A note on the 3 steps that matter most and why
3. A "done right" check at the end
4. A one-page version short enough to print and stick on the wall

Keep the wording simple enough for a new starter. Mark anything I need to confirm with [CHECK].$q$,270),
($q$new-starter-first-week$q$,$q$Help a new starter feel useful in their first week$q$,$q$Any business$q$,$q$Hiring & team$q$,$q$A new person's first week decides how they feel about you for months. Too often it's "just shadow me" and a pile of passwords. This prompt plans a calm, structured first week so they settle in quickly and you're not answering questions all day.$q$,$q$4–6 hrs per new starter$q$,$q$Claude or ChatGPT, then Notion or a shared doc$q$,$q$I've hired a [job title] for [business name], starting on [date]. Their main responsibilities: [list]. Tools and systems they'll use: [list]. Who they'll work with: [names and roles].

Create a first-week plan:
1. Before day one: what to prepare and a friendly welcome message to send them
2. Day by day (Monday to Friday): what they'll learn, do and who they'll meet, with one small real task each day
3. A list of questions they'll probably be too shy to ask, with answers I should give
4. A 15-minute end-of-week chat: 5 questions to ask them

Keep it realistic for a small business. Kind, clear, not corporate.$q$,280),
($q$helpful-one-to-ones$q$,$q$One-to-ones that actually help your team$q$,$q$Any business$q$,$q$Hiring & team$q$,$q$Giving feedback is one of the hardest parts of running a team, especially when you're the friendly boss who works alongside everyone. This prompt helps you prepare a one-to-one that's honest, kind and specific, so it leads to change rather than awkwardness.$q$,$q$1 hr per meeting, plus fewer misunderstandings$q$,$q$Claude or ChatGPT$q$,$q$I've got a one-to-one with [name], who works as [role]. They've been with us [how long].
What's going well: [specific examples]
What I'd like to change: [specific examples, and the impact]
Things that might be going on for them: [e.g. new to the role, busy at home, unclear instructions]

Help me prepare:
1. An opening that puts them at ease
2. How to give the positive feedback specifically, not generically
3. How to raise the issue clearly and kindly, with the exact words I could use
4. 4 open questions to understand their side
5. How to agree one or two next steps together

Keep it a two-way conversation, not a telling-off.$q$,290),
($q$fair-cv-screening$q$,$q$Shortlist applications fairly, in a fraction of the time$q$,$q$Any business$q$,$q$Hiring & team$q$,$q$When 60 applications land for one job, it's tempting to skim and go with your gut, and good people get missed. This prompt scores every application against what the job really needs, so your shortlist is quicker and fairer.$q$,$q$3–5 hrs per hire$q$,$q$Claude or ChatGPT$q$,$q$I'm hiring a [job title]. The must-haves: [list]. The nice-to-haves: [list]. What great looks like in this role: [describe].

Here are the applications (remove names, photos, ages and addresses first):
[paste, numbered]

For each application:
1. Score 1–5 against each must-have, with one line of evidence from what they wrote
2. Note any nice-to-haves
3. One question I should ask them at interview

Then give me a ranked shortlist of the top 5 with a short reason for each. Judge only on skills and experience relevant to the job. Don't penalise career gaps or unusual routes into the role, and flag if my must-haves might be putting good candidates off.$q$,300),
($q$freelancer-brief$q$,$q$A brief a freelancer can't misread$q$,$q$Any business$q$,$q$Hiring & team$q$,$q$Most freelancer disasters start with a vague brief: "make it look modern". Then come the revisions, the extra invoices and the frustration on both sides. This prompt turns your rough idea into a clear brief so you get what you pictured the first time.$q$,$q$2–3 hrs per project, plus fewer re-dos$q$,$q$Claude or ChatGPT$q$,$q$I want to hire a freelancer for: [project, e.g. a logo, a website, product photos, bookkeeping].
What I'm hoping to achieve: [ ]
Who it's for: [my customers]
Examples I like and why: [links or descriptions]
Budget: £[ ] | Deadline: [ ]

Write:
1. A clear brief: background, goal, what's included and what's not, deliverables, file formats, deadline, budget and how I'll give feedback
2. A short job post for a freelance site
3. 5 questions to ask before I hire someone
4. A simple checklist for signing off the work

Point out anything vague in my request that could cause problems later.$q$,310),
($q$numbers-in-plain-english$q$,$q$Understand your numbers in plain English$q$,$q$Any business$q$,$q$Finance$q$,$q$Plenty of brilliant business owners feel a bit lost when the accountant sends over the figures, and that's nothing to be embarrassed about. This prompt explains what your numbers are telling you, in plain English, and what questions to ask next.$q$,$q$1–2 hrs a month, and more confident decisions$q$,$q$Claude or ChatGPT$q$,$q$Here are my business figures for [period] (remove account numbers and anything sensitive):
[paste profit and loss, or monthly income and costs]

My business: [type], [number] staff. What I'm worried about or curious about: [ ].

Explain, in plain English:
1. How the business did overall, in 3 sentences
2. The 3 numbers that matter most here and what they mean
3. Anything that looks unusual, rising or worth a closer look
4. 5 questions I should ask my accountant

Don't give regulated financial or tax advice. Where something needs a professional, say so. Show any sums you do so I can check them.$q$,320),
($q$price-with-confidence$q$,$q$Price your services with confidence$q$,$q$Any business$q$,$q$Finance$q$,$q$Most small business owners undercharge, often because pricing feels personal. When you see your real costs laid out, the right price stops feeling like a guess. This prompt walks you through it step by step.$q$,$q$2–3 hrs, and often more profit per job$q$,$q$Claude or ChatGPT$q$,$q$Help me work out my pricing.
What I sell: [service or product]
Time it takes me per job: [hours]
Direct costs per job: [materials, travel, fees]
Monthly overheads: £[rent, software, insurance, etc.]
How many jobs I can realistically do a month: [ ]
What I want to pay myself a year: £[ ]
What competitors charge, roughly: [ ]

1. Work out my true cost per job and show the sums
2. Suggest a price range with a healthy margin
3. Suggest a simple good, better, best set of packages
4. Write a short, confident sentence for explaining a price rise to existing customers

Show your working so I can check it. If my numbers don't add up to a sustainable business, tell me gently but clearly.$q$,330),
($q$find-money-leaks$q$,$q$Find the money quietly leaking out of your business$q$,$q$Any business$q$,$q$Finance$q$,$q$Subscriptions you forgot about, a supplier who crept up their prices, software three people pay for separately. None of it is dramatic, but it adds up. Export a few months of spending and this prompt helps you spot what to cut or renegotiate.$q$,$q$1–2 hrs, often saving £100s a year$q$,$q$Claude or ChatGPT$q$,$q$Here are my business outgoings for the last [3] months (description, amount, date; remove card and account numbers):
[paste]

My business: [type], [number] staff.

1. Group the spending into categories with monthly totals
2. List every recurring subscription or payment, and flag any that look duplicated, unused or unusually expensive
3. Spot any costs that have risen over the period
4. Suggest the 5 changes that would save the most, with a rough saving for each
5. Write a short, polite email I could send a supplier to ask for a better price

Show the sums. Only flag what the data actually shows, and ask me about anything you can't tell.$q$,340),
($q$cost-a-menu-dish$q$,$q$Cost a dish and price your menu properly$q$,$q$Restaurants & cafés$q$,$q$Finance$q$,$q$I ran two restaurants, so I know how tight the margin on a plate can be, and how easily it slips when ingredient prices creep up. This prompt costs your dishes properly and suggests prices, so every plate earns its place on the menu.$q$,$q$2–3 hrs a menu, and better margins$q$,$q$Claude or ChatGPT$q$,$q$Help me cost my menu. For each dish, here are the ingredients, the amount used per portion, and what I pay for them:
[Dish 1: ingredient, amount per portion, price I pay and pack size]
[Dish 2: ...]

The food cost percentage I'm aiming for: [e.g. 28–32%]. Current menu prices, if any: [ ]. Including VAT? [yes/no]

1. Work out the cost per portion for each dish, showing the sums
2. Suggest a menu price for each to hit my target, before and after VAT
3. Flag dishes that are underpriced or have the worst margins
4. Suggest small tweaks (portion, garnish, a swap) that improve margin without hurting the dish

Show your working clearly so I can check every number.$q$,350)
on conflict (slug) do nothing;