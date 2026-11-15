#!/bin/bash
set -euo pipefail

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.command // empty')

if [[ -z "$command" ]]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

if [[ "$command" =~ RAILS_ENV=test([[:space:]]|$) ]] || [[ "$command" =~ RAILS_ENV=\"test\" ]] || [[ "$command" =~ RAILS_ENV=\'test\' ]]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

blocked_pattern='(bin/)?(rails|rake)[[:space:]]+(db:drop|db:reset|db:migrate:reset|db:schema:load|db:setup)([[:space:]|&;]|$)'

if [[ "$command" =~ $blocked_pattern ]]; then
  jq -n \
    --arg user_message "Blocked: destructive Rails DB command against development. Use RAILS_ENV=test for test DB only, or run the exact wipe yourself." \
    --arg agent_message "Denied db wipe/reset/schema:load/setup without RAILS_ENV=test. Condensing migrations does not authorize wiping development data. Ask the user if a wipe is truly required." \
    '{permission: "deny", user_message: $user_message, agent_message: $agent_message}'
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0
