import os
import json

def generate_content_index(base_path="."):
    content_index = {
        "articles": [],
        "projects": []
    }

    # Process Articles
    articles_path = os.path.join(base_path, "Articles")
    for root, _, files in os.walk(articles_path):
        for file in files:
            if file.endswith(".md"):
                relative_path = os.path.relpath(os.path.join(root, file), base_path)
                content_index["articles"].append({
                    "path": relative_path.replace(os.sep, "/")
                })

    # Process Projects
    projects_path = os.path.join(base_path, "Projects")
    for root, _, files in os.walk(projects_path):
        for file in files:
            if file.endswith(".md"):
                relative_path = os.path.relpath(os.path.join(root, file), base_path)
                content_index["projects"].append({
                    "path": relative_path.replace(os.sep, "/")
                })

    with open(os.path.join(base_path, "content_index.json"), "w", encoding="utf-8") as f:
        json.dump(content_index, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    generate_content_index("/home/ubuntu/offici5l.github.io_debug")


