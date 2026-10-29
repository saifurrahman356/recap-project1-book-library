import { isBook } from "./types.js";
const BOOK_API = "http://localhost:4730/books";
export async function fetchBooks() {
    const response = await fetch(BOOK_API);
    if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error("Invalid response: expected an array of books");
    }
    return data.filter(isBook);
}
export async function fetchBookByIsbn(isbn) {
    const response = await fetch(`${BOOK_API}/${encodeURIComponent(isbn)}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.status}`);
    }
    const data = await response.json();
    if (!isBook(data)) {
        throw new Error("Invalid book data");
    }
    return data;
}
