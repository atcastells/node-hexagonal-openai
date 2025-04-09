#!/bin/bash

# create_rule.sh - Script to create Cursor rules with proper formatting
# Place in the .cursor folder and make executable with: chmod +x create_rule.sh

# Ensure rules directory exists
mkdir -p .cursor/rules

# Help message
usage() {
  echo "Usage: ./create_rule.sh <rule_name> <rule_type> <description> [content_file] [title]"
  echo ""
  echo "Creates a new Cursor rule with the specified parameters"
  echo ""
  echo "Arguments:"
  echo "  rule_name     - Name of the rule file (without .mdc extension)"
  echo "  rule_type     - Type of rule: 'always', 'auto_attached', 'agent_requested', or 'manual'"
  echo "  description   - Brief description of the rule"
  echo "  content_file  - Optional: Path to markdown file to use as rule content"
  echo "  title         - Optional: Title of the rule (defaults to rule_name if not provided)"
  echo ""
  echo "Examples:"
  echo "  ./create_rule.sh python-style always 'Python coding style guidelines'"
  echo "  ./create_rule.sh react-components auto_attached 'React component structure' ./react-rules.md"
  echo "  ./create_rule.sh database-access agent_requested 'Database access patterns' ./db-patterns.md 'Database Patterns'"
  echo "  ./create_rule.sh custom-title always 'Rule with custom title' '' 'Custom Title'"
  exit 1
}

# Check for minimum required arguments
if [ $# -lt 3 ]; then
  usage
fi

RULE_NAME="$1"
RULE_TYPE="$2"
DESCRIPTION="$3"
CONTENT_FILE=""
TITLE=""

# Handle optional arguments based on count
if [ $# -eq 4 ]; then
  # Check if 4th arg is a file
  if [ -f "$4" ]; then
    CONTENT_FILE="$4"
    TITLE="${RULE_NAME^}"  # Default to capitalized rule name
  else
    # 4th arg is title
    TITLE="$4"
  fi
fi

if [ $# -eq 5 ]; then
  # 4th arg is content file (might be empty string), 5th is title
  if [ -n "$4" ] && [ -f "$4" ]; then
    CONTENT_FILE="$4"
  fi
  TITLE="$5"
fi

# Default title if not set
if [ -z "$TITLE" ]; then
  TITLE="${RULE_NAME^}"  # Default to capitalized rule name
fi

# Path for the rule file
RULE_FILE=".cursor/rules/${RULE_NAME}.mdc"

# Configure rule based on type
case "$RULE_TYPE" in
  always)
    ALWAYS_APPLY="true"
    GLOBS=""
    ;;
  auto_attached)
    ALWAYS_APPLY="false"
    GLOBS="*.py"  # Default to Python files
    ;;
  agent_requested)
    ALWAYS_APPLY="false"
    GLOBS=""
    ;;
  manual)
    ALWAYS_APPLY="false"
    GLOBS=""
    DESCRIPTION=""
    ;;
  *)
    echo "Error: Invalid rule type '${RULE_TYPE}'"
    usage
    ;;
esac

# Create the rule file
echo "Creating rule file: ${RULE_FILE}"

# Create rule header
{
  echo "---"
  if [ -n "$DESCRIPTION" ]; then
    echo "description: ${DESCRIPTION}"
  fi
  if [ -n "$GLOBS" ]; then
    echo "globs: ${GLOBS}"
  fi
  echo "alwaysApply: ${ALWAYS_APPLY}"
  echo "---"
  echo "# ${TITLE}"
  echo ""
} > "$RULE_FILE"

# Add content from file if specified, otherwise add placeholder
if [ -n "$CONTENT_FILE" ] && [ -f "$CONTENT_FILE" ]; then
  cat "$CONTENT_FILE" >> "$RULE_FILE"
  echo "✓ Added content from file: $CONTENT_FILE"
else
  echo "Add your rule content here." >> "$RULE_FILE"
fi

# Verify file creation
if [ -f "$RULE_FILE" ]; then
  echo "✅ Rule file created successfully!"
  echo "File location: ${RULE_FILE}"
  echo ""
  echo "File content:"
  cat "$RULE_FILE"
else
  echo "❌ Failed to create rule file!"
fi 