import type { Book } from "./types.js";
import { fetchBooks } from "./bookService.js";

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
    favoriteButton.textContent = "♡";
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
  } catch (error) {
    bookCount.textContent = "Could not load books";
    console.error("Error loading books:", error);
  }
}

init();
