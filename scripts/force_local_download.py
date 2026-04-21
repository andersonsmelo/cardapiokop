#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
from pathlib import Path


def list_dataless(root: Path) -> list[Path]:
    cmd = ["find", str(root), "-flags", "+dataless", "-type", "f"]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    files = [Path(line) for line in result.stdout.splitlines() if line.strip()]
    return sorted(files)


def ls_flags(path: Path) -> str:
    result = subprocess.run(
        ["ls", "-ldO", str(path)],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.stdout.strip()


def trigger_download(path: Path) -> None:
    subprocess.run(["brctl", "download", str(path)], check=False)


def wait_until_local(path: Path, timeout_s: int, poll_s: float) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        flags = ls_flags(path)
        if "dataless" not in flags:
            return True
        time.sleep(poll_s)
    return False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Force local download of iCloud dataless files."
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional file or directory paths. Defaults to current directory.",
    )
    parser.add_argument("--timeout", type=int, default=45)
    parser.add_argument("--poll", type=float, default=1.5)
    args = parser.parse_args()

    targets = [Path(p).resolve() for p in args.paths] or [Path.cwd()]
    all_files: list[Path] = []

    for target in targets:
        if not target.exists():
            print(f"[skip] missing: {target}")
            continue
        if target.is_file():
            all_files.append(target)
        else:
            all_files.extend(list_dataless(target))

    # Deduplicate while preserving order
    deduped: list[Path] = []
    seen: set[Path] = set()
    for path in all_files:
        if path not in seen:
            seen.add(path)
            deduped.append(path)

    if not deduped:
        print("No dataless files found.")
        return 0

    print(f"Found {len(deduped)} dataless file(s).")
    failures: list[Path] = []

    for path in deduped:
        before = ls_flags(path)
        print(f"\n[download] {path}")
        print(f"  before: {before}")
        trigger_download(path)
        ok = wait_until_local(path, timeout_s=args.timeout, poll_s=args.poll)
        after = ls_flags(path)
        print(f"  after:  {after}")
        if ok:
            print("  result: hydrated locally")
        else:
            print("  result: still dataless")
            failures.append(path)

    if failures:
        print("\nFailed to hydrate:")
        for path in failures:
            print(f" - {path}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
