import re
import os

# 1. Update SectionDivider.jsx for thicker and colored line
with open('src/components/SectionDivider.jsx', 'r', encoding='utf-8') as f:
    sd_content = f.read()

old_line = '''      <div
        className="section-divider-line"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: `${color}24`,
        }}
      />'''

new_line = '''      <div
        className="section-divider-line"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: color,
          opacity: inView ? 0.8 : 0.25,
          filter: inView ? "grayscale(0)" : "grayscale(1)",
          transition: "filter 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s",
        }}
      />'''

if 'height: 1,' in sd_content:
    sd_content = sd_content.replace(old_line, new_line)
    with open('src/components/SectionDivider.jsx', 'w', encoding='utf-8') as f:
        f.write(sd_content)


# 2. Update SectionSidebar.jsx to accept theme="green"
with open('src/components/SectionSidebar.jsx', 'r', encoding='utf-8') as f:
    sb_content = f.read()

sb_content = sb_content.replace('export default function SectionSidebar({ items }) {', 'export default function SectionSidebar({ items, theme = "gold" }) {')
sb_content = sb_content.replace('background: isActive ? (isDark ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.15)") : "transparent",', 'background: isActive ? (theme === "green" ? "rgba(22,161,75,0.15)" : (isDark ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.15)")) : "transparent",')
sb_content = sb_content.replace('color: isActive ? (isDark ? "#c9a84c" : "#a17f1e") : (isDark ? "#ffffff" : "#6b6f91"),', 'color: isActive ? (theme === "green" ? "#16a14b" : (isDark ? "#c9a84c" : "#a17f1e")) : (isDark ? "#ffffff" : "#6b6f91"),')

with open('src/components/SectionSidebar.jsx', 'w', encoding='utf-8') as f:
    f.write(sb_content)


# 3. Update AutoCountTrainingWebGL.jsx to support activeVideoMeta.start
with open('src/components/AutoCountTrainingWebGL.jsx', 'r', encoding='utf-8') as f:
    webgl_content = f.read()

old_iframe = "src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1${activeVideoMeta.playlistId ? '&list=' + activeVideoMeta.playlistId : ''}`}"
new_iframe = "src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1${activeVideoMeta.start ? '&start=' + activeVideoMeta.start : ''}${activeVideoMeta.playlistId ? '&list=' + activeVideoMeta.playlistId : ''}`}"

if 'activeVideoMeta.start' not in webgl_content:
    webgl_content = webgl_content.replace(old_iframe, new_iframe)
    with open('src/components/AutoCountTrainingWebGL.jsx', 'w', encoding='utf-8') as f:
        f.write(webgl_content)


# 4. Update AutoCountCloudAccounting.jsx
with open('src/pages/products/AutoCountCloudAccounting.jsx', 'r', encoding='utf-8') as f:
    acc_cloud = f.read()

# Update SectionSidebar to have theme="green"
acc_cloud = acc_cloud.replace('<SectionSidebar items={SIDEBAR_ITEMS} />', '<SectionSidebar items={SIDEBAR_ITEMS} theme="green" />')

# Replace CLOUD_VIDEOS array
old_videos = '''const CLOUD_VIDEOS = [
  {
    id: 'pHRMw-oo0o0?start=39',
    label: 'General Tutorial',
    description: 'Learn AutoCount CloudAccounting in Just 30 Minutes. A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.',
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'pHRMw-oo0o0',
    label: 'e-Invoice Tutorial',
    description: 'Learn how to generate e-Invoices with AutoCount CloudAccounting seamlessly.',
    note: 'e-Invoice Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  }
];'''

new_videos = '''const CLOUD_VIDEOS = [
  {
    id: 'NNnJevwax-8',
    label: 'Software Introduction',
    description: 'A brief introduction to AutoCount CloudAccounting and its capabilities.',
    note: 'Introduction',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  },
  {
    id: 'pHRMw-oo0o0',
    start: 39,
    label: 'General Tutorial',
    description: 'Learn AutoCount CloudAccounting in Just 30 Minutes. A fast orientation for owners and accounts teams who want to understand the workflow before starting a trial.',
    note: 'Quick-Start Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  {
    id: 'pHRMw-oo0o0',
    label: 'e-Invoice Tutorial',
    description: 'Learn how to generate e-Invoices with AutoCount CloudAccounting seamlessly.',
    note: 'e-Invoice Guide',
    icon: <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  }
];'''

if 'Software Introduction' not in acc_cloud:
    acc_cloud = acc_cloud.replace(old_videos, new_videos)

with open('src/pages/products/AutoCountCloudAccounting.jsx', 'w', encoding='utf-8') as f:
    f.write(acc_cloud)

print("Applied changes!")
