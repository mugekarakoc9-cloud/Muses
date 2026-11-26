#!/usr/bin/env python3
"""Package only runtime assets; never include local exports or signing material."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

root = Path(__file__).resolve().parents[1]
output = root / 'dist-linux'
output.mkdir(exist_ok=True)
files = ['index.html', 'p1-activity.js', 'p1-planning.js', 'p1-studio.js',
         'p1-studio.css', 'sw.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']
with tempfile.TemporaryDirectory() as temp:
    package = Path(temp) / 'MUSES-Linux'
    www = package / 'www'
    www.mkdir(parents=True)
    for file in files:
        shutil.copy2(root / file, www / file)
    shutil.copytree(root / 'assets/mimo', www / 'assets/mimo')
    for file in ['app.py', 'install.py']:
        shutil.copy2(root / 'linux-wrapper' / file, package / file)
    shutil.copy2(root / 'KURULUM-OZEL.md', package / 'KURULUM.md')
    with zipfile.ZipFile(output / 'MUSES-Linux.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(package.rglob('*')):
            if file.is_file():
                archive.write(file, file.relative_to(package.parent))
    if shutil.which('dpkg-deb'):
        deb = Path(temp) / 'deb'
        app = deb / 'usr/share/muses'
        app.mkdir(parents=True)
        shutil.copytree(www, app / 'www')
        shutil.copy2(package / 'app.py', app / 'app.py')
        applications = deb / 'usr/share/applications'
        applications.mkdir(parents=True)
        (applications / 'muses.desktop').write_text(
            '[Desktop Entry]\nType=Application\nName=MUSES\n'
            'Exec=python3 /usr/share/muses/app.py\nIcon=/usr/share/muses/www/icon-192.png\n'
            'Terminal=false\nCategories=Office;Education;\n')
        control = deb / 'DEBIAN'
        control.mkdir()
        (control / 'control').write_text(
            'Package: muses-private\nVersion: 0.15.9\nSection: utils\nPriority: optional\n'
            'Architecture: all\nDepends: python3\nRecommends: chromium | chromium-browser | google-chrome-stable | firefox\n'
            'Maintainer: MUSES personal application <noreply@example.invalid>\n'
            'Description: Private local MUSES learning and life studio\n'
            ' Runs on loopback using the installed browser. No public hosting.\n')
        subprocess.run(['dpkg-deb', '--root-owner-group', '--build', str(deb),
                        str(output / 'MUSES-Linux.deb')], check=True)
print('Linux packages:', output)
