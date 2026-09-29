# Arc Labs: Project Proposal (M1)

**Team:**
- Ryan Lildhar
- Clinton Paul-Chinka
- Raqeeb Akber
- Andy Donghakia
- Clover Espiritu-Santo

**Website link:** we will add this when the site is online

## Topic

**App name:** _[App name]_, a periodic table explorer.

Our project is a website about the elements of the periodic table. A lot of periodic table sites have too much on the screen, are hard to use on a phone, and only use colour to show the type of each element, which is a problem for colour-blind people. We want to make one that is easier to use, mostly for students.

In our app you can see all 118 elements in a grid or a list. You can search for an element, filter them, and sort them. Each element has its own page with more info. You can also save your favourite elements and compare two elements next to each other.

## Data Source

We are using the [Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON) file by Bowserinator. It has all 118 elements in one JSON file. It is free, there is no API key, and there is no limit on how much we can use it. The file has an `elements` list inside it. Temperatures are in Kelvin, and if something is missing it is set to `null`.

Here is an example of one element (shortened):

```json
{
  "elements": [
    {
      "name": "Hydrogen",
      "symbol": "H",
      "number": 1,
      "period": 1,
      "category": "diatomic nonmetal",
      "atomic_mass": 1.008,
      "phase": "Gas",
      "melt": 13.99,
      "boil": 20.271,
      "density": 0.08988,
      "molar_heat": 28.836,
      "electronegativity_pauling": 2.20,
      "discovered_by": "Henry Cavendish",
      "summary": "Hydrogen is a chemical element with chemical symbol H and atomic number 1...",
      "xpos": 1,
      "ypos": 1,
      "shells": [1],
      "electron_configuration": "1s1",
      "bohr_model_image": "https://storage.googleapis.com/search-ar-edu/periodic-table/element_001_hydrogen/element_001_hydrogen_srp_th.png"
    }
  ]
}
```

**How we will use the data**

- The app loads the data once when it starts. We will share it with all the pages using React Context. There are only 118 elements, so searching, filtering and sorting can all happen in the browser.
- We will write a function that changes each element into the format we want. It will remove extra spaces from the category names, change `null` to "Not available", and give each element a colour.
- We will keep a copy of the JSON file in our repo (in `/public/data`). If the online file does not load, we can still use ours.
- While the data is loading the app shows a loading message. If it fails, it shows an error and a retry button. If a search has no results, it shows a message saying so.

**Images**

The data has a `bohr_model_image` link for each element. This is a picture of the atom and its electron shells. Since links can break, we will also draw our own shell diagram using the `shells` numbers in the data.

The data does not have photos of the elements that we can count on. For photos we plan to use [Wikimedia Commons](https://commons.wikimedia.org/), which has free images of a lot of elements. We will save the images in our repo and give credit on the detail page. If an element has no image, we will show a box with its symbol instead.

**Why we did not use ApiVerve**

ApiVerve was our other option, but we decided against it for a few reasons:
- It needs an API key. Our app has no backend, so anyone could open the browser tools and find the key.
- The free plan is very limited. You only get a small number of requests per month and only a few per minute. It is also only for non-commercial use, and you have to give credit to ApiVerve.
- The better limits come with the paid plans like Pro, which cost money every month. We do not have a budget, and Bowserinator gives us the data for free.

## Comparators

| Site | What it does well | How ours is different |
|---|---|---|
| **[Ptable.com](https://ptable.com)** | Lots of info and different ways to look at the table | It is crowded and hard to use on a phone. Ours works on small screens and can be used with only a keyboard. |
| **[Royal Society of Chemistry periodic table](https://periodic-table.rsc.org)** | Info you can trust and a good page for each element | You cannot save favourites or compare elements, and there are not many filters. |
| **[PubChem periodic table](https://pubchem.ncbi.nlm.nih.gov/periodic-table/)** | Very detailed science data | It is made for researchers. Ours is simpler and made for students, and it has a compare tool. |

Our app is different because it works on phones, tablets and computers. The category colours are easy to tell apart, and we also add labels so colour is not the only clue. You can move around the table with the keyboard. You can also save favourites and compare elements.

## Scaled Feature Plan

The whole team works on the main setup together. This is the routing between pages, the layout, loading the data, the colours and theme, accessibility, and putting the site online. After that, each person builds one full feature of their own, including the design, the code, the page, the tests and the accessibility.

| Member | Feature | Page | What it includes |
|---|---|---|---|
| **Clover** | Periodic table grid | `/` | Shows the elements in the shape of the periodic table using `xpos` and `ypos`. Each category has a colour and there is a legend. On small screens it turns into a list. |
| **Ryan** | Search, filter and sort | `/` (top bar) | A `useElementFilters` hook. You can search by name, symbol or number, filter by category, phase and period, and sort the elements. Shows a message when nothing matches. |
| **Andy** | Element detail page | `/element/:number` | Uses the element number in the URL. Shows a table of properties and a diagram of the electron shells. Has next and previous buttons and handles element numbers that do not exist. |
| **Raqeeb** | Favourites | `/favourites` | A `useFavourites` hook that saves to `localStorage`. There is a favourite button on the cards and detail page, and a page that lists your favourites. Raqeeb also sets up the repo and puts the site on Netlify. |
| **Clinton** | Compare tool | `/compare` | A form where you pick two elements and a metric, like atomic mass, density, melting point, boiling point, electronegativity or ionization energy. It shows the two values side by side with a bar chart and tells you which one is higher and by how much. It also checks for mistakes, like picking the same element twice. Clinton also makes the colour palette, icons and wireframes. |

**About the compare metrics:** Our data does not have reactivity or electrical conductivity. We will use electronegativity and ionization energy to compare how reactive elements are. If we have time, we will add conductivity using a small extra data file made from a trusted source like Wikipedia.

**Testing:** Everyone writes tests for their own code, like the filter and sort functions, saving favourites, and picking elements to compare. We also test our components.

**Accessibility:** We will use the right HTML tags, put labels on all form fields, keep clear focus outlines, make the grid work with a keyboard, and check that our colours have enough contrast.

**If we have extra time:** a quiz or flashcard mode, and a small backend.

## Wireframes

