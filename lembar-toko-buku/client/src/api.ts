import type { Book, BookInput } from "./types";

// Endpoint yang sudah ada di server.js Week 10
const API = "/api/books";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Server tidak merespons. Pastikan backend (npm start) sedang berjalan.");
  }

  if (!res.ok) {
    let pesan = `Permintaan gagal (${res.status}).`;
    try {
      const body = await res.json();
      if (body.message) pesan = body.message; // server.js memakai field "message"
    } catch {
      /* bukan JSON, pakai pesan bawaan */
    }
    throw new Error(pesan);
  }
  return res.json() as Promise<T>;
}

export const getBooks = () => request<Book[]>(API);

export const createBook = (data: BookInput) =>
  request<Book>(API, { method: "POST", body: JSON.stringify(data) });

export const updateBook = (id: number, data: BookInput) =>
  request<Book>(`${API}/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteBook = (id: number) =>
  request<{ message: string }>(`${API}/${id}`, { method: "DELETE" });
