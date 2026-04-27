import xml.etree.ElementTree as ET
import urllib.request
import sys

SITEMAP_URL = 'https://greenhybridpower.in/sitemap.xml'

try:
    urllib.request.urlretrieve(SITEMAP_URL, 'sitemap.tmp.xml')
    tree = ET.parse('sitemap.tmp.xml')
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = [u.text for u in tree.findall('.//ns:loc', ns)]
    print(f'Found {len(urls)} URLs in sitemap')
    errors = []
    for u in urls:
        try:
            r = urllib.request.urlopen(u, timeout=15)
            code = r.getcode()
            print(u, code)
            if code >= 400:
                errors.append((u, code))
        except Exception as e:
            print(u, 'ERROR', str(e))
            errors.append((u, str(e)))
    if errors:
        print('\nBroken URLs:')
        for e in errors:
            print(e)
        sys.exit(2)
    else:
        print('\nAll sitemap URLs returned 2xx/3xx')
        sys.exit(0)
except Exception as e:
    print('Failed to fetch or parse sitemap:', e)
    sys.exit(1)
