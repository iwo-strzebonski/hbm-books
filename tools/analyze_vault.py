import os
import re
import json

VAULT_DIR = "ObsidianNotes"

def main():
    if not os.path.exists(VAULT_DIR):
        print(json.dumps({"error": f"Directory {VAULT_DIR} not found."}))
        return

    md_files = {} # filename (without .md) -> relative path
    for root, dirs, files in os.walk(VAULT_DIR):
        for file in files:
            if file.endswith(".md"):
                name = file[:-3]
                rel_path = os.path.relpath(os.path.join(root, file), VAULT_DIR)
                md_files[name] = rel_path

    links = {} # source file rel_path -> list of target link names
    broken_links = [] # list of (source file rel_path, broken link name)
    incoming_links = {name: [] for name in md_files.keys()} # target name -> list of source file rel_paths

    link_pattern = re.compile(r'\[\[(.*?)\]\]')

    for name, rel_path in md_files.items():
        full_path = os.path.join(VAULT_DIR, rel_path)
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {rel_path}: {e}")
            continue

        file_links = link_pattern.findall(content)
        parsed_links = []
        for raw_link in file_links:
            # Handle aliases [[Link|Alias]] and headings [[Link#Heading]]
            base_link = raw_link.split('|')[0].split('#')[0].strip()
            if not base_link:
                continue
            parsed_links.append(base_link)
            
            # Check if it exists
            link_basename = os.path.basename(base_link)
            if link_basename.endswith('.md'):
                link_basename = link_basename[:-3]
                
            if link_basename in md_files:
                incoming_links[link_basename].append(rel_path)
            else:
                broken_links.append((rel_path, base_link))
                
        links[rel_path] = parsed_links

    orphans = [rel_path for name, rel_path in md_files.items() if len(incoming_links[name]) == 0]

    report = {
        "total_files": len(md_files),
        "total_links": sum(len(l) for l in links.values()),
        "broken_links_count": len(broken_links),
        "orphans_count": len(orphans),
        "broken_links": broken_links,
        "orphans": orphans
    }

    with open("vault_analysis_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("Analysis complete. Check vault_analysis_report.json")

if __name__ == "__main__":
    main()
