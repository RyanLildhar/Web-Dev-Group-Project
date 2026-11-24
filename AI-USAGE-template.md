# AI-USAGE.md

This file logs every time an AI tool contributed to submitted code in this project.
Add an entry before you commit the AI-assisted code. (Using AI only to learn -
explanations, error messages, design talk - does not need an entry.) See the course AI
policy. Reminder: **milestones 1-2 (weeks 3, 6) must be AI-free** - this file should
be empty until the third milestone.

Also drop a marker where the code lives: `// AI-assisted - see AI-USAGE.md #<n>`.

---

## Entry template (copy for each use)

### #N - <short title>
- **Date:** YYYY-MM-DD
- **Member:** <your name>
- **Tool / model:** <e.g. free-tier assistant> (free models only)
- **Files:** `src/...`, `src/...`
- **Prompt (verbatim):**

  ```
  <paste the exact prompt you gave the AI>
  ```

- **What it produced & what I changed:** <1–3 sentences: did you keep it as-is, edit it,
  rewrite parts? why is it correct?>

---

## Log

<!-- Entries go below, newest last. Example: -->

### #1 - Compare Modal Implementation
- **Date:** 2026-11-22
- **Member:** Clinton Paul-Chinka
- **Tool / model:** Gemini free-tier assistant
- **Files:** `src/CompareModal.jsx`,`src/App.jsx`,`src/Card.jsx`,`src/Grid.jsx`,`src/styles/styles.css`
- **Prompt (verbatim):**

  
  ```
  write logic to implement a modal when the 'compare-tool' button is clicked, toggling a selection mode on the grid cards to pick two elements. Upon selection of    the elements, then an appropriately sized modal dialog renders the detail view of each element in a table.
  ```

- **What it produced & what I changed:**  Produced CompareModal.jsx logic and styling,  along with props to match. I kept the logic, props and edited the styling to fix the modal table header.
