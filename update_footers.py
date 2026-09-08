import os

files = [
    "about-us.html",
    "contact.html",
    "how-it-works.html",
    "market-insights.html",
    "products.html",
    "services.html"
]

search_text = """        <div class="footer-large-logo">
            <div class="footer-logo-icon"></div>
            AORR
        </div>"""

replace_text = """        <div class="footer-large-logo" style="display: flex; justify-content: center; align-items: center;">
            <img src="images/logo.png" alt="AORR Logo" style="height: 220px;">
        </div>"""

for filename in files:
    path = os.path.join(os.getcwd(), filename)
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
        
        if search_text in content:
            new_content = content.replace(search_text, replace_text)
            with open(path, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Pattern not found in {filename}")
    else:
        print(f"File not found: {filename}")
