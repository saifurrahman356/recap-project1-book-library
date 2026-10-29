import type { Book } from "./types.js";
import { fetchBooks } from "./bookService.js";
import {
  isFavorite,
  toggleFavorite,
  updateFavoriteCount,
} from "./favoriteService.js";
const bookList = document.querySelector<HTMLTableSectionElement>("#book-list");
const bookCount = document.querySelector<HTMLHeadingElement>("#book-count");
const searchInput = document.querySelector<HTMLInputElement>("#search");
const publisherSelect =
  document.querySelector<HTMLSelectElement>("#by-publisher");
const searchForm = document.querySelector<HTMLFormElement>("#search-form");
const publisherForm =
  document.querySelector<HTMLFormElement>("#publisher-form");

if (
  !bookList ||
  !bookCount ||
  !searchInput ||
  !publisherSelect ||
  !searchForm ||
  !publisherForm
) {
  throw new Error("Required HTML elements not found");
}

let allBooks: Book[] = [];

function renderBooks(books: Book[]): void {
  if (!(bookList instanceof HTMLTableSectionElement)) {
    return;
  }

  if (!(bookCount instanceof HTMLHeadingElement)) {
    return;
  }

  bookList.replaceChildren();

  if (books.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.textContent = "No books found.";

    row.append(cell);
    bookList.append(row);
  }

  for (const book of books) {
    const row = document.createElement("tr");

    const favoriteCell = document.createElement("td");
    const favoriteButton = document.createElement("button");

    favoriteButton.type = "button";
    favoriteButton.className = "button button-clear fav-btn";

    function updateHeart(): void {
      const favorite = isFavorite(book.isbn);

      favoriteButton.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="${favorite ? "currentColor" : "none"}"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="fav"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  `;

      favoriteButton.setAttribute(
        "aria-label",
        favorite ? "Remove from favorites" : "Add to favorites",
      );
      favoriteButton.setAttribute("aria-pressed", String(favorite));
    }

    favoriteButton.addEventListener("click", () => {
      toggleFavorite(book);
      updateHeart();
      updateFavoriteCount();
    });

    updateHeart();
    favoriteCell.append(favoriteButton);

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
    detailLink.href = `detail.html?isbn=${encodeURIComponent(book.isbn)}`;
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

    bookList.append(row);
  }

  bookCount.textContent = `${books.length} Books displayed`;
}

function populatePublishers(books: Book[]): void {
  if (!(publisherSelect instanceof HTMLSelectElement)) {
    return;
  }
  const publishers = [
    ...new Set(books.map((book) => book.publisher.trim())),
  ].sort();

  for (const publisher of publishers) {
    const option = document.createElement("option");

    option.value = publisher;
    option.textContent = publisher;

    publisherSelect.append(option);
  }
}

function filterBooks(): void {
  if (!(searchInput instanceof HTMLInputElement)) {
    return;
  }
  if (!(publisherSelect instanceof HTMLSelectElement)) {
    return;
  }
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedPublisher = publisherSelect.value;

  const filteredBooks = allBooks.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm);

    const matchesPublisher =
      selectedPublisher === "-" ||
      selectedPublisher === "" ||
      book.publisher === selectedPublisher;

    return matchesTitle && matchesPublisher;
  });

  renderBooks(filteredBooks);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterBooks();
});

publisherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterBooks();
});

searchInput.addEventListener("input", filterBooks);
publisherSelect.addEventListener("change", filterBooks);

async function init(): Promise<void> {
  if (!(bookCount instanceof HTMLHeadingElement)) {
    return;
  }

  try {
    const books = await fetchBooks();

    allBooks = books;
    populatePublishers(allBooks);
    renderBooks(allBooks);
    updateFavoriteCount();
  } catch (error) {
    bookCount.textContent = "Could not load books";
    console.error("Error loading books:", error);
  }
}

init();
