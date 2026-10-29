import { STORAGE_KEY } from "./types.js";
export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return [];
    }
    try {
        const data = JSON.parse(stored);
        if (!Array.isArray(data)) {
            return [];
        }
        return data.filter(isFavoriteBook);
    }
    catch {
        return [];
    }
}
function isFavoriteBook(value) {
    return (typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "string" &&
        "title" in value &&
        typeof value.title === "string" &&
        "isbn" in value &&
        typeof value.isbn === "string" &&
        "author" in value &&
        typeof value.author === "string" &&
        "publisher" in value &&
        typeof value.publisher === "string");
}
export function isFavorite(isbn) {
    return getFavorites().some((book) => book.isbn === isbn);
}
export function toggleFavorite(book) {
    const favorites = getFavorites();
    const index = favorites.findIndex((favorite) => favorite.isbn === book.isbn);
    if (index !== -1) {
        favorites.splice(index, 1);
    }
    else {
        const favorite = {
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            author: book.author,
            publisher: book.publisher,
        };
        favorites.push(favorite);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
export function updateFavoriteCount() {
    const count = document.querySelector("#favorite-count");
    if (count) {
        count.textContent = String(getFavorites().length);
    }
}
