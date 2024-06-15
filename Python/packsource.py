import os
import zipfile
import re
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_FOLDER = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FOLDER = os.path.join(os.getcwd(), 'output')

FILE_TYPES = ['.js', '.jsx', '.ts', '.tsx', '.prisma', '.json', '.md', '.scss', '.css']
EXCLUDE_FOLDERS = ['.next', '.trunk', 'node_modules', '.vscode', '.git', 'Python', 'output']
EXCLUDE_FILES = ['package-lock.json', '*.log', '*.lock', '*.env', '*.yaml', '*.test.js', '*.spec.js', '*.map', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'trunk.yaml']
EXCLUDE_SUBDIRS = [os.path.join('src', 'app', '(payload)')]

def remove_comments(content, file_type):
    if file_type in ['.js', '.jsx', '.ts', '.tsx']:
        pattern = r"//.*?$|/\*.*?\*/|#.*?$|\'(?:\\.|[^\\\'])*\'|\"(?:\\.|[^\\\"])*\"|@(?:\\.|[^\\\"])*\""
        regex = re.compile(pattern, re.DOTALL | re.MULTILINE)
        no_comments = re.sub(regex, "", content)
        return no_comments
    else:
        return content

def get_source_files(root_dir, hours_ago=0):
    file_paths = []
    time_ago = time.time() - hours_ago*60*60  # Time hours_ago hours ago

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]
        if any(subdir in root for subdir in EXCLUDE_SUBDIRS):
            continue
        for file in files:
            if file.lower().endswith(tuple(FILE_TYPES)) and file not in EXCLUDE_FILES:
                file_path = os.path.join(root, file)
                if hours_ago and os.path.getmtime(file_path) < time_ago:
                    continue  # Skip this file, it was not modified in the last hours_ago hours
                relative_path = os.path.relpath(file_path, ROOT_FOLDER) 
                file_paths.append(relative_path)
                
    return file_paths

def write_source_files(file_paths, output_file):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        for file in file_paths:
            f.write(f'// {file}\n')
            with open(os.path.join(ROOT_FOLDER, file), 'r', encoding='utf-8') as source_file:
                file_type = os.path.splitext(file)[1]
                f.write(remove_comments(source_file.read(), file_type))
            f.write('\n\n')

if __name__ == '__main__':
    recent_files = get_source_files(ROOT_FOLDER, hours_ago=4)
    recent_file_path = os.path.join(OUTPUT_FOLDER, 'recentfilechanges.txt')
    write_source_files(recent_files, recent_file_path)

    all_files = get_source_files(ROOT_FOLDER)
    all_file_path = os.path.join(OUTPUT_FOLDER, 'all_source_files.txt')
    write_source_files(all_files, all_file_path)