import os
import base64

OUTPUT_FILE = 'repo_dump.txt'

# Get list of files from git to ensure we only include tracked files
import subprocess
result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True, check=True)
files = result.stdout.strip().split('\n')

with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
    # Write structure header
    out.write('Repository Structure:\n')
    for root, dirs, _ in os.walk('.', topdown=True):
        # skip .git directory
        if '.git' in dirs:
            dirs.remove('.git')
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        level = root.count(os.sep)
        indent = '    ' * level
        out.write(f"{indent}{os.path.basename(root)}/\n")
    out.write('\nFile Contents:\n')

    for file_path in files:
        if not os.path.exists(file_path):
            continue
        out.write(f"\n===== {file_path} =====\n")
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            try:
                text = data.decode('utf-8')
                out.write(text)
            except UnicodeDecodeError:
                b64 = base64.b64encode(data).decode('ascii')
                out.write(f"[binary base64]\n{b64}\n")
        except Exception as e:
            out.write(f"Error reading {file_path}: {e}\n")
print(f"Repository dumped to {OUTPUT_FILE}")
