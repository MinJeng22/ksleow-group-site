import os

file_path = 'src/styles/global.css'

with open(file_path, 'r', encoding='utf-8') as f:
    css = f.read()

old_css = """.ks-bento-card.is-clickable:hover {
  transform: translateY(-4px);
  border-color: rgba(201,168,76,0.5);
  box-shadow: 0 24px 58px rgba(47,49,90,0.11);
}"""

new_css = """.ks-bento-card.is-clickable:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(201,168,76,0.5);
  box-shadow: 0 24px 58px rgba(47,49,90,0.11);
}"""

if old_css in css:
    css = css.replace(old_css, new_css)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Replaced successfully with exact match.")
else:
    # Try replacing just the transform line
    old_line = "  transform: translateY(-4px);\n  border-color: rgba(201,168,76,0.5);"
    new_line = "  transform: translateY(-4px) scale(1.02);\n  border-color: rgba(201,168,76,0.5);"
    if old_line in css:
        css = css.replace(old_line, new_line)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(css)
        print("Replaced successfully with line match.")
    else:
        # One more try without \n
        css = css.replace("transform: translateY(-4px);", "transform: translateY(-4px) scale(1.02);")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(css)
        print("Replaced successfully using simple replace.")
