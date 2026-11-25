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


### #2 - Compare Modal Unit Testing
- **Date:** 2026-11-24
- **Member:** Clinton Paul-Chinka
- **Tool / model:** Gemini free-tier assistant
- **Files:** `src/CompareModal.jsx`
- **Prompt (verbatim):**
  
  ```
  Write a simple, focused test for the React component below using Vitest and React Testing Library in a Vite project.
  What the feature should do:
    - When clicked, a selection of two elements should be available, 
  Keep the test clean, avoid over-mocking internal implementation details, and tell me briefly if I need any extra test setup or packages.
  ```

- **What it produced & what I changed:**  Produced CompareModal.test.jsx, I did not edit the file but I installed and added dev dependencies and configured the Vite config file


### #3 - Favourites Unit Testing
- **Date:** 2026-11-24
- **Member:** <your name>
- **Tool / model:** Claude (<free tier / model name, check the policy>)
- **Files:** `src/features/favourites/Favourites.test.jsx`
- **Prompt (verbatim):**

  ```
Generate a Vitest test file for the FavouriteButton, FavouritesPage, and useFavourites hook using React Testing Library. Test saving and removing favourites, button states, click events, displaying saved elements in the correct order, and showing an empty message. Test that favourites are saved to and loaded from localStorage, including handling invalid or corrupted data.  ```

- **What it produced & what I changed:** Produced tests for FavouriteButton, FavouritesPage and the useFavourites hook, first as three files and then merged into one file on request. The first run failed because vitest doesn't auto-clean rendered components, so I added `afterEach(cleanup)` and scoped the page queries with `within(container)`. All tests pass with `npm test`.