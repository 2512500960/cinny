#!/usr/bin/env python3
"""Fill empty translation keys in target locales from base locale.

Usage:
  python3 scripts/fill_translations.py --root public/locales --base en --targets de zh --backup

This script looks for translation files under <root>/<lang>/translation.json (or .js).
If a target value is empty (empty string or None) or missing, it will be filled from the base locale.
Backups are created when writing changes.
"""
import argparse
import json
import os
import shutil
import time
from typing import Any, Dict


def is_empty_value(v: Any) -> bool:
    return v is None or (isinstance(v, str) and v.strip() == "")


def load_translation(path: str) -> (Dict, str):
    text = None
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    if path.endswith(".json"):
        return json.loads(text), "json"

    # .js heuristic: try to detect wrapper (export default / module.exports)
    wrapper = "raw"
    if "export default" in text:
        wrapper = "export_default"
    elif "module.exports" in text:
        wrapper = "module_exports"

    # extract first outermost { ... }
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError(f"Could not find JSON object in {path}")

    body = text[start : end + 1]
    return json.loads(body), wrapper


def save_translation(path: str, data: Dict, wrapper: str, make_backup: bool = True) -> None:
    if make_backup and os.path.exists(path):
        bak = f"{path}.bak.{int(time.time())}"
        shutil.copy2(path, bak)

    dumped = json.dumps(data, ensure_ascii=False, indent=2)
    if wrapper == "json" or wrapper == "raw":
        with open(path, "w", encoding="utf-8") as f:
            f.write(dumped + "\n")
    elif wrapper == "export_default":
        with open(path, "w", encoding="utf-8") as f:
            f.write("export default ")
            f.write(dumped)
            f.write(";\n")
    elif wrapper == "module_exports":
        with open(path, "w", encoding="utf-8") as f:
            f.write("module.exports = ")
            f.write(dumped)
            f.write(";\n")
    else:
        with open(path, "w", encoding="utf-8") as f:
            f.write(dumped + "\n")


def fill_missing(base: Dict, target: Dict) -> bool:
    """Recursively fill missing or empty values in target from base. Return True if changed."""
    changed = False
    for k, base_v in base.items():
        if k not in target:
            target[k] = base_v
            changed = True
            continue

        tgt_v = target[k]
        # both dict -> recurse
        if isinstance(base_v, dict) and isinstance(tgt_v, dict):
            if fill_missing(base_v, tgt_v):
                changed = True
            continue

        # if target is empty -> replace
        if is_empty_value(tgt_v):
            target[k] = base_v
            changed = True

    return changed


def find_file(root: str, lang: str):
    jpath = os.path.join(root, lang, "translation.json")
    if os.path.exists(jpath):
        return jpath
    jspath = os.path.join(root, lang, "translation.js")
    if os.path.exists(jspath):
        return jspath
    raise FileNotFoundError(f"No translation file for lang '{lang}' under {root}/{lang}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--root", default="public/locales", help="locales root folder")
    p.add_argument("--base", default="en", help="base language (has complete translations)")
    p.add_argument("--targets", nargs="+", required=True, help="target languages to fill (e.g. de zh)")
    p.add_argument("--backup", action="store_true", help="create timestamped backup before writing")
    args = p.parse_args()

    root = args.root
    base_lang = args.base

    base_path = find_file(root, base_lang)
    base_data, base_wrapper = load_translation(base_path)

    changed_any = False
    for t in args.targets:
        try:
            tpath = find_file(root, t)
        except FileNotFoundError as e:
            print(e)
            continue

        tgt_data, tgt_wrapper = load_translation(tpath)
        print(f"Checking {tpath} (wrapper={tgt_wrapper}) against base {base_path}")
        if fill_missing(base_data, tgt_data):
            save_translation(tpath, tgt_data, tgt_wrapper, make_backup=args.backup)
            print(f"Updated and saved: {tpath}")
            changed_any = True
        else:
            print(f"No changes needed for: {tpath}")

    if not changed_any:
        print("No files were changed.")


if __name__ == "__main__":
    main()
