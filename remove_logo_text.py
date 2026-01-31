import os
import re

files = [
    "index.html",
    "about-us.html",
    "services.html",
    "products.html",
    "market-insights.html",
    "how-it-works.html",
    "contact.html"
]

# Regex to find the span after the logo image within the logo anchor
# Looking for: <span style="letter-spacing: 4px;">AORR</span>
# We'll just replace it with empty string
pattern = re.compile(r'<span style="letter-spacing: 4px;">AORR</span>')

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
            
        new_content = re.sub(pattern, '', content)
        
        if len(new_content) != len(content):
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Removed text from {filename}")
        else:
            print(f"Text not found in {filename}")
    else:
        print(f"File not found: {filename}")
