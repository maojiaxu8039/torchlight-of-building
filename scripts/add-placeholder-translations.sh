#!/bin/bash

# Add placeholder translations to zh/common.po

PO_FILE="/Users/mc/.openclaw/workspace/torchlight-of-building/src/locales/zh/common.po"

# Translations to add
TRANSLATIONS=(
  "<Select Base Stats>:<选择基底词缀>"
  "<Select {affixType}>:<选择 {affixType}>"
  "<Select Pactspirit>:<选择契约之灵>"
  "<Select Destiny>:<选择命运>"
  "Select an active skill...:选择主动技能..."
  "Select base affix...:选择基础词缀..."
  "Select area expansion...:选择范围扩展..."
  "Select affix...:选择词缀..."
  "Select a legendary...:选择传奇装备..."
  "Select a blend...:选择混合词缀..."
  "Select equipment type...:选择装备类型..."
  "Select pactspirit...:选择契约之灵..."
  "Select {0} Affix {1}:选择 {0} 词缀 {1}"
  "Select memory type...:选择记忆类型..."
  "Select rarity...:选择稀有度..."
  "Select level...:选择等级..."
  "Select base stat...:选择基础属性..."
  "Select legendary...:选择传奇..."
  "Select tier:选择等级"
  "Select rank:选择等级"
  "Select option:选择选项"
  "Select a hero...:选择英雄..."
  "Select Level:选择等级"
)

# Check if PO file exists
if [ ! -f "$PO_FILE" ]; then
  echo "Error: PO file not found at $PO_FILE"
  exit 1
fi

echo "Adding placeholder translations to $PO_FILE..."
echo ""

# Add each translation
for entry in "${TRANSLATIONS[@]}"; do
  IFS=':' read -r msgid msgstr <<< "$entry"

  # Check if the msgid already exists
  if grep -q "msgid \"$msgid\"" "$PO_FILE"; then
    echo "✓ Already exists: $msgid"
  else
    echo "Adding: $msgid → $msgstr"
    # Use awk to insert after the header
    awk -v msgid="$msgid" -v msgstr="$msgstr" '
      BEGIN { added=0 }
      /^msgstr ""$/ && !added && getline > 0 {
        print "msgid \"" msgid "\""
        print "msgstr \"" msgstr "\""
        print ""
        added=1
      }
      { print }
    ' "$PO_FILE" > "${PO_FILE}.tmp" && mv "${PO_FILE}.tmp" "$PO_FILE"
  fi
done

echo ""
echo "Done! Please run 'pnpm lingui:compile' to update the compiled translations."
