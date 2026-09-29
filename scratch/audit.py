import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print(f"Auditing {len(html_files)} HTML files...")

errors = 0
link_count = 0

tag_attr_pattern = re.compile(r'(src|srcset|href)=["\']([^"\']+)["\']')

def clean_url(url_candidate):
    url_candidate = url_candidate.strip()
    parts = url_candidate.split()
    if len(parts) > 1 and re.match(r'^\d+[xw]$', parts[-1]):
        url_candidate = ' '.join(parts[:-1])
    return url_candidate

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = tag_attr_pattern.findall(content)
    for attr_name, raw_val in matches:
        if attr_name == 'srcset':
            entries = [e.strip() for e in raw_val.split(',')]
        else:
            entries = [raw_val]

        for entry in entries:
            ref_clean = clean_url(entry)
            if not ref_clean or ref_clean.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:', 'data:')):
                continue
            
            target_path = ref_clean.split('?')[0].split('#')[0]
            target_path = target_path.replace('%20', ' ')
            if not target_path:
                continue
                
            link_count += 1
            if not os.path.exists(target_path):
                print(f"[ERROR] Broken link in {html_file}: '{ref_clean}' -> '{target_path}' not found")
                errors += 1

print(f"\nAudit complete: Checked {link_count} relative links across {len(html_files)} HTML files.")
if errors == 0:
    print("SUCCESS: 0 broken links found! All assets and internal pages exist perfectly.")
else:
    print(f"FAILED: {errors} broken links found.")
