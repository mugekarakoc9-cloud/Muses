#!/usr/bin/env python3
"""Install the portable package for the current Linux user, without sudo."""
import os
from pathlib import Path
import shutil
import subprocess
import sys

source = Path(__file__).resolve().parent
data = Path(os.environ.get('XDG_DATA_HOME', str(Path.home() / '.local/share')))
destination = data / 'muses'
destination.mkdir(parents=True, exist_ok=True)
shutil.copy2(source / 'app.py', destination / 'app.py')
shutil.copytree(source / 'www', destination / 'www', dirs_exist_ok=True)
applications = data / 'applications'
applications.mkdir(parents=True, exist_ok=True)
quoted = str(destination / 'app.py').replace('\\', '\\\\').replace('"', '\\"').replace('`', '\\`').replace('$', '\\$')
(applications / 'muses.desktop').write_text(
    '[Desktop Entry]\nType=Application\nName=MUSES\nComment=Kişisel yaşam ve öğrenme ajandan\n'
    f'Exec=python3 "{quoted}"\nIcon={destination / "www/icon-192.png"}\n'
    'Terminal=false\nCategories=Office;Education;\n', encoding='utf-8')
print('Kuruldu. Uygulamalar menüsünden MUSES’i açabilirsin.')
subprocess.run([sys.executable, str(destination / 'app.py')], check=True)
