import os
import re

# 1. Update global.css
css_path = 'src/styles/global.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

new_css = '''
.ks-btn-hrms { background: #8e44ad; border-color: #8e44ad; color: #fff; }
.ks-btn-hrms:hover { background: #9b59b6; border-color: #9b59b6; }
.ks-btn-onesale { background: #1bb4a6; border-color: #1bb4a6; color: #fff; }
.ks-btn-onesale:hover { background: #26c6da; border-color: #26c6da; }
.ks-btn-serverlink { background: #d32f2f; border-color: #d32f2f; color: #fff; }
.ks-btn-serverlink:hover { background: #e53935; border-color: #e53935; }
'''
if '.ks-btn-hrms' not in css_content:
    css_content = css_content.replace('.ks-btn-whatsapp {\n    background: #25D366;\n    border-color: #25D366;\n    color: #ffffff;\n  }', '.ks-btn-whatsapp {\n    background: #25D366;\n    border-color: #25D366;\n    color: #ffffff;\n  }\n' + new_css)
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)

def update_simple_page(path, title, old_icon, new_icon, theme_class):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'import useFavicon' not in content:
        content = content.replace('import ProductHero', 'import useFavicon from "../../hooks/useFavicon.js";\nimport ProductHero')
    
    if 'const WA_LINK' not in content:
        wa_link = f'\nconst WA_LINK = `https://wa.me/60179052323?text=${{encodeURIComponent("Hi KS Support Team, I would like to learn more about {title}. Thank you.")}}`;\n'
        content = content.replace('export default function', wa_link + 'export default function')
    
    if 'useFavicon(' not in content:
        content = content.replace('useEffect(() => {', f'useFavicon("{new_icon}");\n  useEffect(() => {{')
        
    content = content.replace(old_icon, new_icon)
    
    # Update buttons
    old_btn = 'primaryCta={{ label: "Enquire Now", onClick: onContact }}'
    new_btn = f'primaryCta={{{{ label: "Start Free Trial", onClick: onContact, className: "{theme_class}" }}}}\n          secondaryCta={{{{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}}}'
    if old_btn in content:
        content = content.replace(old_btn, new_btn)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# HRMS
update_simple_page('src/pages/products/AutoCountHRMS.jsx', 'AutoCount HRMS', '/images/products/hrms-logo-2024_white-1024x288.webp', '/images/products/hrms-icon.webp', 'ks-btn-hrms')
# OneSale
update_simple_page('src/pages/products/AutoCountOneSale.jsx', 'AutoCount OneSale', '/images/products/autocount-onesales.webp', '/images/products/onesales-icon.webp', 'ks-btn-onesale')
# ServerLink
update_simple_page('src/pages/products/ServerLink.jsx', 'ServerLink', '/images/products/serverlink-logo.webp', '/images/products/serverlink-icon.png', 'ks-btn-serverlink')

# FeedMePOS
feedme_path = 'src/pages/products/FeedMePOS.jsx'
with open(feedme_path, 'r', encoding='utf-8') as f:
    feedme = f.read()

feedme = feedme.replace('Request Demo', 'Start Free Trial')
feedme = re.sub(r'<a\s+href=\{WA_LINK\}[^>]*>.*?</a>', r'''<a
                      href={WA_LINK} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                      onMouseOut ={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    >
                      WhatsApp Us
                    </a>''', feedme, flags=re.DOTALL)
with open(feedme_path, 'w', encoding='utf-8') as f:
    f.write(feedme)

print("Done")
