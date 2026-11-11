## M1 Frontend prototype

**What state lives in the store and what stays inside a component? Why?**

State that is shared across multiple pages or needs to survive navigation lives in the Pinia store. For example, the `courts` and `sports` arrays live in `useCatalogStore`, along with the `loading` and `error` flags. This is because the Home page and the Court Detail page both need to know about the courts, and we don't want to re-fetch them from the API every time we navigate between pages. 

State that is only relevant to a specific view lives locally inside that component. For example, in `CourtsView.vue`, the `selectedSportId` (which tab is clicked) is a local `ref`. If the user navigates away and comes back, it resets to "All", which is fine. 

Derived state (like the filtered list of visible courts) is a `computed` property inside the component. It reads from the store state and the local state, but it does not store its own copy. This prevents the data from getting out of sync.