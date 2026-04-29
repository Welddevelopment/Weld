import subprocess
import sys

result = subprocess.run([sys.executable, "C:\\Users\\cubit\\Downloads\\Weld-app\\create_docx_xml.py"],
                       capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
print("Return code:", result.returncode)
