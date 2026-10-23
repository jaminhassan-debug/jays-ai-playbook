import json
LOGO='https://jaysaiplaybook.blog/wp-content/uploads/2026/10/email-logo.png'
INK,MUTED,ACCENT,BG,LINE='#0E1433','#55607A','#2B44E6','#F3F5F9','#DCE1EC'
F="'Helvetica Neue',Helvetica,Arial,sans-serif"
def mail(pre,h,ps,btn,after):
    p=''.join(f'<p style="margin:0 0 16px;font:16px/1.55 {F};color:{INK}">{x}</p>' for x in ps)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{h}</title></head>
<body style="margin:0;padding:0;background:{BG}">
<div style="display:none;max-height:0;overflow:hidden">{pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{BG}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="padding:0 4px 20px"><img src="{LOGO}" alt="Jay's AI Playbook" width="170" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="background:#FFFFFF;border:1px solid {LINE};border-radius:16px;padding:32px 28px">
<h1 style="margin:0 0 16px;font:700 24px/1.25 {F};color:{INK}">{h}</h1>
{p}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td style="background:{ACCENT};border-radius:999px"><a href="{{{{ .ConfirmationURL }}}}" style="display:inline-block;padding:14px 26px;font:700 16px {F};color:#FFFFFF;text-decoration:none">{btn}</a></td></tr></table>
<p style="margin:0 0 12px;font:14px/1.5 {F};color:{MUTED}">{after}</p>
<p style="margin:0;font:14px/1.5 {F};color:{MUTED}">Didn't ask for this? You can safely ignore this email. Nothing will change.</p>
</td></tr>
<tr><td style="padding:20px 4px 0;font:13px/1.5 {F};color:{MUTED}">Jay's AI Playbook · <a href="https://jaysaiplaybook.blog" style="color:{MUTED}">jaysaiplaybook.blog</a><br>Questions? Just reply to this email, it comes straight to me.</td></tr>
</table></td></tr></table></body></html>'''
T=[
 ("magic","Magic link","Your sign-in link for Jay's AI Playbook",mail("Tap the button to sign in. No password needed.","Here's your sign-in link",["Hi there,","Tap the button below to sign in to your members area. There's no password to remember."],"Sign in to my members area","The link works once and runs out after an hour. If it's expired, just ask for a new one on the sign-in page.")),
 ("confirm","Confirm signup","Welcome to Jay's AI Playbook: confirm your email",mail("One tap and your free members area is ready.","Welcome! One tap and you're in",["Hi there,","Thanks for joining Jay's AI Playbook. Tap the button below to confirm your email and open your free members area, with your own 90-day AI plan and every free prompt in one place."],"Confirm and open my members area","The link works once and runs out after an hour. If it's expired, just ask for a new one on the sign-in page.")),
 ("change","Change email address","Confirm your new email address",mail("Confirm the new email for your members area.","Confirm your new email address",["Hi there,","You asked to change the email address on your Jay's AI Playbook members area. Tap the button below to confirm it."],"Confirm my new email","If you didn't ask for this change, reply to this email and I'll look into it straight away.")),
]
json.dump([{"id":a,"where":b,"subject":c,"html":d} for a,b,c,d in T],open('templates.json','w'))
for a,b,c,d in T: open(a+'.html','w').write(d.replace('{{ .ConfirmationURL }}','https://jaysaiplaybook.blog/members/'))
print([len(x[3]) for x in T])
