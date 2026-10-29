import { fetchBookByIsbn } from "./bookService.js";
import { isBook, type Book } from "./types.js";

function renderBookDetails(book: Book): void {
  document.querySelector("#book-title")!.textContent = book.title;
  document.querySelector("#book-subtitle")!.textContent = book.subtitle;
  document.querySelector("#book-abstract")!.textContent = book.abstract;
  document.querySelector("#book-author")!.textContent = book.author;
  document.querySelector("#book-publisher")!.textContent = book.publisher;
  document.querySelector("#book-pages")!.textContent = String(book.numPages);
  document.querySelector("#book-isbn")!.textContent = book.isbn;
  document.querySelector("#book-price")!.textContent =
    `${book.price} ${book.currency}`;

  const cover = document.querySelector<HTMLImageElement>("#book-cover")!;

  cover.src = book.cover;
  cover.alt = `Cover of ${book.title}`;
}

async function init(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const isbn = params.get("isbn");

  if (!isbn) {
    document.querySelector("#book-title")!.textContent = "No ISBN provided";
    return;
  }

  try {
    const book = await fetchBookByIsbn(isbn);
    renderBookDetails(book);
  } catch (error) {
    document.querySelector("#book-title")!.textContent =
      "Could not load book details";

    console.error(error);
  }
}

init();
