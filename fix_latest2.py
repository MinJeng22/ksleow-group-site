import os

# 1. Update SectionDivider.jsx to have gradient
with open('src/components/SectionDivider.jsx', 'r', encoding='utf-8') as f:
    sd_content = f.read()

old_bg = 'background: color,'
new_bg = 'background: `linear-gradient(90deg, transparent, ${color}, transparent)`,'

if 'linear-gradient(90deg' not in sd_content:
    sd_content = sd_content.replace(old_bg, new_bg)
    with open('src/components/SectionDivider.jsx', 'w', encoding='utf-8') as f:
        f.write(sd_content)

# 2. Update AutoCountTrainingWebGL.jsx to accept title prop
with open('src/components/AutoCountTrainingWebGL.jsx', 'r', encoding='utf-8') as f:
    webgl_content = f.read()

webgl_content = webgl_content.replace(
    "export default function AutoCountTrainingWebGL({ customVideos, themeColor = '#80c31e', themeHoverColor = '#8bc34a', activeTabBg = '#2f315a', playIconColor = '#2f315a', playBtnBg = '#e8c97a' }) {",
    "export default function AutoCountTrainingWebGL({ customVideos, title = 'AutoCount Accounting Quick-Start Guide', themeColor = '#80c31e', themeHoverColor = '#8bc34a', activeTabBg = '#2f315a', playIconColor = '#2f315a', playBtnBg = '#e8c97a' }) {"
)

webgl_content = webgl_content.replace(
    "AutoCount Accounting Quick-Start Guide",
    "{title}"
)
# Note: we need to be careful with {title} replacement if it's already inside {title}
if '<h2>{title}</h2>' not in webgl_content:
    webgl_content = webgl_content.replace(
        "            {title}\n            </h2>",
        "            {title}\n            </h2>"
    ) # oops wait, it was originally `            AutoCount Accounting Quick-Start Guide\n            </h2>`
    # let's just do a string replace on the exact text
    webgl_content = webgl_content.replace('>\n            {title}\n            </h2>', '>\n            {title}\n            </h2>')
    webgl_content = webgl_content.replace('>\n            AutoCount Accounting Quick-Start Guide\n            </h2>', '>\n            {title}\n            </h2>')
    
    with open('src/components/AutoCountTrainingWebGL.jsx', 'w', encoding='utf-8') as f:
        f.write(webgl_content)

# 3. Update AutoCountCloudAccounting.jsx
with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    acc_cloud = f.read()

# Update General Tutorial ID and remove start
old_video = """  {
    id: 'pHRMw-oo0o0',
    start: 39,"""
new_video = """  {
    id: 'M8j_39IEpjQ',"""
acc_cloud = acc_cloud.replace(old_video, new_video)

# Update WebGL component props
old_webgl_props = """          <AutoCountTrainingWebGL 
            customVideos={CLOUD_VIDEOS} 
            themeColor="#16a14b" 
            themeHoverColor="#19b554" 
            playBtnBg="#16a14b" 
            playIconColor="#ffffff" 
          />"""
new_webgl_props = """          <AutoCountTrainingWebGL 
            customVideos={CLOUD_VIDEOS} 
            title="AutoCount CloudAccounting Quick-Start Guide"
            themeColor="#0d6efd" 
            themeHoverColor="#0b5ed7" 
            activeTabBg="#0d6efd"
            playBtnBg="#0d6efd" 
            playIconColor="#ffffff" 
          />"""
acc_cloud = acc_cloud.replace(old_webgl_props, new_webgl_props)

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(acc_cloud)

print("Applied fixes!")
