import os
import re
import time

# Determine the directory where the script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Determine the root folder as one directory up from the script's location
ROOT_FOLDER = os.path.dirname(SCRIPT_DIR)

# Output folder in the same directory as the script
OUTPUT_FOLDER = os.path.join(SCRIPT_DIR, 'output')

# Define the file types to include
FILE_TYPES = ['.js', '.jsx', '.ts', '.tsx', '.prisma', '.json', '.md', '.scss', '.css']

# Define folders and files to exclude
EXCLUDE_FOLDERS = ['.next', '.trunk', 'node_modules', '.vscode', '.git', 'Python', 'output']
EXCLUDE_FILES = ['package-lock.json', '*.log', '*.lock', '*.env', '*.yaml', '*.test.js', '*.spec.js', '*.map', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'trunk.yaml']

# Define subdirectories to include explicitly
INCLUDE_SUBDIRS = ['app', 'frontend', 'components', 'convex', 'hooks', 'lib']

# List of important root-level files to include
IMPORTANT_ROOT_FILES = [
    'middleware.ts', 'package.json', 'next-env.d.ts', 'next.config.js', 'tsconfig.json'
]

def remove_comments(content, file_type):
    """Remove comments from the given content based on the file type."""
    if file_type in ['.js', '.jsx', '.ts', '.tsx']:
        pattern = r"//.*?$|/\*.*?\*/|#.*?$|\'(?:\\.|[^\\\'])*\'|\"(?:\\.|[^\\\"])*\"|@(?:\\.|[^\\\"])*\""
        regex = re.compile(pattern, re.DOTALL | re.MULTILINE)
        no_comments = re.sub(regex, "", content)
        return no_comments
    else:
        return content

def optimize_whitespace(content):
    """Optimize whitespace in the content."""
    # Replace multiple spaces with a single space
    content = re.sub(r'\s+', ' ', content)

    # Trim leading and trailing whitespace from each line
    content = '\n'.join(line.strip() for line in content.splitlines() if line.strip())

    return content

def should_include_file(file_path):
    """Check if the file should be included based on its extension and name."""
    _, ext = os.path.splitext(file_path)
    return ext in FILE_TYPES and not any(file_path.endswith(ex) for ex in EXCLUDE_FILES)

def get_source_files(root_dir, hours_ago=0):
    """Get a list of source files modified within a certain time period."""
    file_paths = []
    time_ago = time.time() - hours_ago * 60 * 60  # Time hours_ago hours ago

    for root, dirs, files in os.walk(root_dir):
        # Exclude specified directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_FOLDERS]

        # Include only specified directories recursively
        if any(os.path.join(root_dir, inc_dir) in root for inc_dir in INCLUDE_SUBDIRS) or root == ROOT_FOLDER:
            for file in files:
                # Check if the file is an important root-level file or matches the specified file types
                file_path = os.path.join(root, file)
                if (file in IMPORTANT_ROOT_FILES or should_include_file(file_path)) and file not in EXCLUDE_FILES:
                    # Check if the file was modified within the specified time period
                    if hours_ago and os.path.getmtime(file_path) < time_ago:
                        continue

                    # Calculate the relative path from the root directory
                    relative_path = os.path.relpath(file_path, ROOT_FOLDER)
                    file_paths.append(relative_path)

    return file_paths

def write_source_files(file_paths, output_file):
    """Write the source files to the output file, stripping comments."""
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        for file in file_paths:
            f.write(f'// {file}\n')
            with open(os.path.join(ROOT_FOLDER, file), 'r', encoding='utf-8') as source_file:
                file_type = os.path.splitext(file)[1]
                content = source_file.read()
                content = remove_comments(content, file_type)
                content = optimize_whitespace(content)
                f.write(content)
            f.write('\n\n')

if __name__ == '__main__':
    # Get recent files modified within the last 4 hours
    recent_files = get_source_files(ROOT_FOLDER, hours_ago=4)
    recent_file_path = os.path.join(OUTPUT_FOLDER, 'recentfilechanges.txt')
    write_source_files(recent_files, recent_file_path)

    # Get all source files
    all_files = get_source_files(ROOT_FOLDER)
    all_file_path = os.path.join(OUTPUT_FOLDER, 'all_source_files.txt')
    write_source_files(all_files, all_file_path)

    print(f"Recent files written to: {recent_file_path}")
    print(f"All files written to: {all_file_path}")
