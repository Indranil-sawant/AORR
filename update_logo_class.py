import os

files = [
    "index.html",
    "about-us.html",
    "services.html",
    "products.html",
    "market-insights.html",
    "how-it-works.html",
    "contact.html"
]

search_str = '<img src="images/logo.png" alt="AORR Logo" style="height: 100px; margin-right: 10px;">'
replace_str = '<img src="images/logo.png" alt="AORR Logo" class="nav-logo-img">'

for filename in files:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        if search_str in content:
            new_content = content.replace(search_str, replace_str)
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"String not found in {filename}")
    else:
        print(f"File not found: {filename}")
