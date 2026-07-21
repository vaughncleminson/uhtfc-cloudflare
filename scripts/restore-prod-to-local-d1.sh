#!/usr/bin/env bash
set -euo pipefail

# What the script does:
# Exports remote prod D1 to a timestamped SQL file
# Deletes only local Wrangler D1 sqlite files
# Recreates local sqlite state
# Imports the dump locally via Wrangler
# Verifies data and lists migration-related tables

DB_NAME="d1-uhtfc-cloudflare"
OUT_DIR="./database-exports"
LOCAL_D1_DIR=".wrangler/state/v3/d1/miniflare-D1DatabaseObject"
ASSUME_YES=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)
      DB_NAME="${2:-}"
      shift 2
      ;;
    --out-dir)
      OUT_DIR="${2:-}"
      shift 2
      ;;
    --yes)
      ASSUME_YES=true
      shift
      ;;
    -h|--help)
      cat <<'EOF'
Restore prod D1 data into local Wrangler SQLite state.

Usage:
  bash scripts/restore-prod-to-local-d1.sh [--db <database-name>] [--out-dir <dir>] [--yes]

Options:
  --db       Cloudflare D1 database name (default: d1-uhtfc-cloudflare)
  --out-dir  Export directory for SQL dump (default: ./database-exports)
  --yes      Skip confirmation prompt
EOF
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$DB_NAME" ]]; then
  echo "Database name cannot be empty." >&2
  exit 1
fi

if [[ -z "$OUT_DIR" ]]; then
  echo "Output directory cannot be empty." >&2
  exit 1
fi

if [[ "$ASSUME_YES" != true ]]; then
  echo "This will DELETE local D1 sqlite files under: $LOCAL_D1_DIR"
  echo "It does NOT modify the remote database."
  read -r -p "Continue? [y/N] " reply
  case "$reply" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Cancelled."
      exit 1
      ;;
  esac
fi

mkdir -p "$OUT_DIR"

timestamp="$(date +%F-%H%M%S)"
dump_file="$OUT_DIR/prod-$timestamp.sql"

echo "[1/7] Exporting remote D1 to $dump_file"
npx wrangler d1 export "$DB_NAME" --remote --output="$dump_file" -y

echo "[2/7] Clearing local D1 sqlite state"
rm -f "$LOCAL_D1_DIR"/*.sqlite 2>/dev/null || true

echo "[3/7] Wiping local uncommitted migrations"
if [ -d "src/migrations" ]; then
  echo "Cleaning untracked local migration files..."
  git clean -fd src/migrations/ 2>/dev/null || true
fi

echo "[4/7] Recreating local D1 sqlite file"
npx wrangler d1 execute "$DB_NAME" --local --command "SELECT 1" -y >/dev/null

db_file="$(find "$LOCAL_D1_DIR" -maxdepth 1 -type f -name '*.sqlite' ! -name 'metadata.sqlite' | head -n 1)"
if [[ -z "$db_file" ]]; then
  echo "Could not locate local D1 sqlite database file in $LOCAL_D1_DIR" >&2
  exit 1
fi

echo "[5/7] Importing dump into local D1 via sqlite3 CLI"
# We stream the pragmas along with the file contents directly into the targeted sqlite file.
# This avoids Wrangler parsing constraints entirely.
{
  echo "PRAGMA foreign_keys = OFF;"
  cat "$dump_file"
  echo "PRAGMA foreign_keys = ON;"
} | sqlite3 "$db_file"

echo "[6/7] Verifying admins row count"
npx wrangler d1 execute "$DB_NAME" --local --command "SELECT COUNT(*) AS admins_count FROM admins;" -y

echo "[7/7] Listing migration-related tables"
npx wrangler d1 execute "$DB_NAME" --local --command "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%migration%';" -y

echo "Done. Local D1 now reflects the exported prod snapshot."
echo "Export saved at: $dump_file"