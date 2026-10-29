export interface Book {
  id: string;
  isbn: string;
  title: string;
  subtitle: string;
  abstract: string;
  author: string;
  publisher: string;
  price: number;
  currency: string;
  numPages: number;
  cover: string;
  userId: number;
  publishedAt: string;
  coAuthors: string[];
  createdAt: string;
  updatedAt: string;
}

// TODO: What should we do if subtitle is not in the value?
export function isBook(value: unknown): value is Book {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "isbn" in value &&
    typeof value.isbn === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    // "subtitle" in value &&
    // typeof value.subtitle === "string" &&
    "abstract" in value &&
    typeof value.abstract === "string" &&
    "author" in value &&
    typeof value.author === "string" &&
    "publisher" in value &&
    typeof value.publisher === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "currency" in value &&
    typeof value.currency === "string" &&
    "numPages" in value &&
    typeof value.numPages === "number" &&
    "cover" in value &&
    typeof value.cover === "string" &&
    "userId" in value &&
    typeof value.userId === "number" &&
    "publishedAt" in value &&
    typeof value.publishedAt === "string" &&
    "coAuthors" in value &&
    Array.isArray(value.coAuthors) &&
    value.coAuthors.every((coAuthor) => typeof coAuthor === "string") &&
    "createdAt" in value &&
    typeof value.createdAt === "string" &&
    "updatedAt" in value &&
    typeof value.updatedAt === "string"
  );
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

type BookListView = Pick<
  Book,
  "id" | "title" | "isbn" | "author" | "publisher"
>;

type BookDetailsView = Pick<
  Book,
  | "id"
  | "title"
  | "subtitle"
  | "abstract"
  | "author"
  | "publisher"
  | "numPages"
  | "cover"
>;
