import os
import re
from pathlib import Path

# --- CONFIGURATION ---
ROOT_DIR = Path(__file__).parent.parent
VAULT_DIR = ROOT_DIR / "ObsidianNotes"
OUTPUT_DIR = ROOT_DIR / "NotebookLM_Uploads"

# Folders to completely ignore
IGNORE_FOLDERS = {".obsidian", "_assets", "_templates", "revisions", "tabletop-cards"}

# Thematic mapping: Which Obsidian folders go into which macro file
THEME_MAP = {
    "01_System_Rules_and_Mechanics.txt": ["rules", "disciplines", "spells", "items", "races"],
    "02_World_Lore_and_NPCs.txt": ["concepts", "npcs", "organizations", "lore"],
    "03_Atlas_and_Locations.txt": ["locations"],
    "04_Campaigns_and_Characters.txt": ["classes", "player-characters", "conflicts"]
}

# --- REGEX UTILITIES ---
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)

def parse_md_file(file_path, relative_path):
    """Reads a file, extracts YAML, cleans structure, and returns format text."""
    try:
        content = file_path.read_text(encoding="utf-8-sig")
    except Exception as e:
        return f"\n\n[ERROR READING FILE {relative_path}: {str(e)}]\n\n"

    # Separate Frontmatter and Content
    frontmatter = ""
    match = FRONTMATTER_RE.match(content)
    if match:
        frontmatter = match.group(1).strip()
        body = content[match.end():].strip()
    else:
        body = content.strip()

    # Format the file section so NotebookLM sees it as a discrete structured document
    builder = []
    builder.append("\n" + "="*80)
    builder.append(f"START_FILE: {relative_path}")
    builder.append(f"FILENAME: {file_path.name}")
    builder.append("="*80)
    
    if frontmatter:
        builder.append("\n--- METADATA ---")
        builder.append(frontmatter)
        builder.append("----------------\n")
        
    builder.append(body)
    builder.append(f"\nEND_FILE: {relative_path}\n")
    
    return "\n".join(builder)

def main():
    if not VAULT_DIR.exists():
        print(f"[-] Error: Vault directory not found at {VAULT_DIR}")
        return

    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"[+] Initializing vault compilation from: {VAULT_DIR}")

    # Initialize empty text collectors for our themes
    compiled_data = {filename: [] for filename in THEME_MAP.keys()}

    # Walk through the entire Obsidian Vault
    for root, dirs, files in os.walk(VAULT_DIR):
        # In-place filtering to skip ignored root directories
        dirs[:] = [d for d in dirs if d not in IGNORE_FOLDERS]
        
        for file in files:
            if not file.endswith(".md"):
                continue
                
            file_path = Path(root) / file
            # Calculate path relative to the Vault root (e.g., 'spells/academic/fire-magic/fireball.md')
            rel_path = file_path.relative_to(VAULT_DIR)
            root_parent_folder = rel_path.parts[0] # The first subfolder name

            # Find which macro file this note belongs to based on its root parent folder
            target_macro = None
            for macro_file, monitored_folders in THEME_MAP.items():
                if root_parent_folder in monitored_folders:
                    target_macro = macro_file
                    break
            
            # If it's a loose markdown file in the root vault or unmapped, default to Lore
            if not target_macro:
                target_macro = "02_World_Lore_and_NPCs.txt"

            # Parse and append
            formatted_note = parse_md_file(file_path, rel_path)
            compiled_data[target_macro].append(formatted_note)

    # Write the master compiled macro files
    for filename, pieces in compiled_data.items():
        if not pieces:
            print(f"[!] Target file {filename} is empty. Skipping output.")
            continue
            
        out_path = OUTPUT_DIR / filename
        # Combine all files with clear division
        final_content = f"MASTER COMPILATION FOR CATEGORY: {filename}\n" + "\n".join(pieces)
        
        out_path.write_text(final_content, encoding="utf-8")
        print(f"[+] Successfully wrote {len(pieces)} files to -> {out_path.name}")

    print("\n[+] Done! Drag the contents of 'NotebookLM_Uploads' straight into NotebookLM.")

if __name__ == "__main__":
    main()
