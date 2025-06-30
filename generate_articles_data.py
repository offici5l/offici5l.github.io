import os
import json
import re

def parse_markdown_for_metadata(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    title = ""
    excerpt = ""
    category = ""

    # Check if file has YAML front matter
    if content.startswith('---'):
        # Parse YAML front matter
        front_matter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if front_matter_match:
            front_matter = front_matter_match.group(1)
            
            # Extract title
            title_match = re.search(r'title:\s*["\']?(.*?)["\']?\s*$', front_matter, re.MULTILINE)
            if title_match:
                title = title_match.group(1).strip('"\'')
            
            # Extract excerpt
            excerpt_match = re.search(r'excerpt:\s*["\']?(.*?)["\']?\s*$', front_matter, re.MULTILINE)
            if excerpt_match:
                excerpt = excerpt_match.group(1).strip('"\'')
            
            # Extract category
            category_match = re.search(r'category:\s*["\']?(.*?)["\']?\s*$', front_matter, re.MULTILINE)
            if category_match:
                category = category_match.group(1).strip('"\'')
    else:
        # Parse Markdown headers (# ## ###)
        lines = content.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            if line.startswith('# '):
                title = line[2:].strip()
            elif line.startswith('## '):
                excerpt = line[3:].strip()
            elif line.startswith('### '):
                category = line[4:].strip()
            
            # Stop after finding all three or after a few lines
            if title and excerpt and category:
                break
            if i > 10:
                break

    return {
        "title": title,
        "description": excerpt, # Using description for excerpt as per previous structure
        "category": category,
        "filename": os.path.splitext(os.path.basename(filepath))[0]
    }

def generate_articles_json(articles_dir, output_file):
    articles_data = []
    for filename in os.listdir(articles_dir):
        if filename.endswith('.md'):
            filepath = os.path.join(articles_dir, filename)
            metadata = parse_markdown_for_metadata(filepath)
            if metadata["title"] and metadata["description"]:
                articles_data.append(metadata)
    
    # Sort articles by filename for consistent order
    articles_data.sort(key=lambda x: x["filename"])

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(articles_data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    articles_directory = "articles"
    output_json_file = "articles_data.json"
    generate_articles_json(articles_directory, output_json_file)


