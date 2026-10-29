import {
  getFavorites,
  toggleFavorite,
  updateFavoriteCount,
} from "./favoriteService.js";

import type { FavoriteBook } from "./types.js";

const favoriteList =
  document.querySelector<HTMLTableSectionElement>("#favorite-list");
const heading =
  document.querySelector<HTMLHeadingElement>("#favorites-heading");
const searchInput = document.querySelector<HTMLInputElement>("#search");
const publisherSelect =
  document.querySelector<HTMLSelectElement>("#by-publisher");

if (!favoriteList || !heading || !searchInput || !publisherSelect) {
  throw new Error("Required HTML elements not found");
}

let allFavorites: FavoriteBook[] = [];

function renderFavorites(books: FavoriteBook[]): void {
  if (!(favoriteList instanceof HTMLTableSectionElement)) {
    return;
  }

  if (!(heading instanceof HTMLHeadingElement)) {
    return;
  }

  favoriteList.replaceChildren();

  if (books.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.textContent = allFavorites.length
      ? "No matching favorites found."
      : "You have no favorite books yet.";

    row.append(cell);
    favoriteList.append(row);
  }

  for (const book of books) {
    const row = document.createElement("tr");

    const favoriteCell = document.createElement("td");

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "button button-clear fav-btn";
    removeButton.innerHTML = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="fav"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clip-rule="evenodd"
    />
  </svg>
`;
    removeButton.setAttribute("aria-label", "Remove from favorites");

    removeButton.addEventListener("click", () => {
      toggleFavorite(book);
      allFavorites = getFavorites();
      populatePublishers();
      filterFavorites();
      updateFavoriteCount();
    });

    favoriteCell.append(removeButton);

    const titleCell = document.createElement("td");
    titleCell.textContent = book.title;

    const isbnCell = document.createElement("td");
    isbnCell.textContent = book.isbn;

    const authorCell = document.createElement("td");
    authorCell.textContent = book.author;

    const publisherCell = document.createElement("td");
    publisherCell.textContent = book.publisher;

    const detailCell = document.createElement("td");
    const detailLink = document.createElement("a");

    detailLink.className = "button";
    detailLink.href = `details.html?isbn=${encodeURIComponent(book.isbn)}`;
    detailLink.textContent = "Detail";

    detailCell.append(detailLink);

    row.append(
      favoriteCell,
      titleCell,
      isbnCell,
      authorCell,
      publisherCell,
      detailCell,
    );

    favoriteList.append(row);
  }

  heading.textContent = `${allFavorites.length} Favorites on your list`;
}

function populatePublishers(): void {
  if (!(publisherSelect instanceof HTMLSelectElement)) {
    return;
  }

  const selectedPublisher = publisherSelect.value;
  const publishers = [
    ...new Set(allFavorites.map((book) => book.publisher)),
  ].sort();

  publisherSelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All publishers";
  publisherSelect.append(allOption);

  for (const publisher of publishers) {
    const option = document.createElement("option");
    option.value = publisher;
    option.textContent = publisher;
    publisherSelect.append(option);
  }

  publisherSelect.value = publishers.includes(selectedPublisher)
    ? selectedPublisher
    : "";
}

function filterFavorites(): void {
  if (!(searchInput instanceof HTMLInputElement)) {
    return;
  }

  if (!(publisherSelect instanceof HTMLSelectElement)) {
    return;
  }

  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedPublisher = publisherSelect.value;

  const filteredFavorites = allFavorites.filter((book) => {
    const matchesSearch = [book.title, book.isbn, book.author].some((value) =>
      value.toLowerCase().includes(searchTerm),
    );

    const matchesPublisher =
      selectedPublisher === "" || book.publisher === selectedPublisher;

    return matchesSearch && matchesPublisher;
  });

  renderFavorites(filteredFavorites);
}

searchInput.addEventListener("input", filterFavorites);
publisherSelect.addEventListener("change", filterFavorites);

function init(): void {
  allFavorites = getFavorites();
  populatePublishers();
  filterFavorites();
  updateFavoriteCount();
}

init();
