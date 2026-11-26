# Week 14 : Fetch API, React & Tailwind CSS

## Endpoint API

| Method | Endpoint | Fungsi | Kode Prisma |
|---|---|---|---|
| GET | `/api/books` | Menampilkan seluruh data buku | `findMany()` |
| POST | `/api/books` | Menambah buku baru | `create()` |
| PUT | `/api/books/:id` | Mengubah data buku | `update()` |
| DELETE | `/api/books/:id` | Menghapus buku | `delete()` |

## Koneksi Frontend ke Backend

Semua permintaan ke backend lewat satu fungsi `request()` di `client/src/api.ts` yang memakai Fetch API.

```ts
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
      if (body.message) pesan = body.message;
    } catch {}
    throw new Error(pesan);
  }
  return res.json() as Promise<T>;
}
```

- Jika server mati, `fetch` gagal dan dilempar pesan "Server tidak merespons".
- Jika server membalas error, pesan dari field `message` di `server.js` ikut ditampilkan.
- Fungsi `getBooks`, `createBook`, `updateBook`, dan `deleteBook` memanggil `request()` dengan method GET, POST, PUT, dan DELETE.
- Permintaan `/api` dari frontend diteruskan ke backend (`http://localhost:3000`) lewat proxy Vite di `client/vite.config.ts`.

---

## 1. GET: Menampilkan Data

Saat halaman dibuka, `useEffect` di `App.tsx` memanggil `muatData()` satu kali. Fungsi ini memanggil `GET /api/books`, menyimpan hasilnya di state `books`, lalu `books.map()` menampilkan satu `BookCard` untuk setiap buku.

```tsx
async function muatData() {
  try {
    setLoadError(null);
    setBooks(await getBooks());
  } catch (err) {
    setLoadError(err instanceof Error ? err.message : "Gagal memuat data.");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  muatData();
}, []);
```

Jika permintaan gagal, state `loadError` terisi dan banner merah dengan tombol **Coba lagi** muncul.

**Tampilan web**

<img width="2880" height="1636" alt="Screenshot 2026-11-10 204901" src="https://github.com/user-attachments/assets/435ad502-75fb-437f-adff-29c7a43132a0" />

**Tampilan jika web error**

<img width="2880" height="1704" alt="Screenshot 2026-11-25 130056" src="https://github.com/user-attachments/assets/d611e9fd-cdb3-480c-b456-47da378b99c4" />

**Isi tabel Book di Neon**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/e2260f8a-02da-4abc-b41a-c61e33962444" />

---

## 2. POST: Menambah Data

Tombol **Tambah buku** membuka form (`BookForm.tsx`). Isian disimpan di state lokal dengan `useState`. Setelah disimpan, `handleSubmit` memanggil `createBook()` yang mengirim `POST /api/books`. Server menyimpannya dengan `prisma.book.create()`. Setelah berhasil, `muatData()` dipanggil lagi supaya daftar langsung sesuai isi database.

```tsx
async function handleSubmit(data: BookInput) {
  if (editing) await updateBook(editing.id, data);
  else await createBook(data);
  setFormOpen(false);
  showToast("Buku disimpan");
  await muatData();
}
```

Jika permintaan gagal, pesan error tampil di dalam form dan isian yang sudah diketik tidak hilang.

**Database sebelum**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/306e73b9-5999-40c7-9b2c-1ea2d468886d" />

**Form tambah buku**

<img width="2878" height="1620" alt="Screenshot 2026-11-10 204940" src="https://github.com/user-attachments/assets/7a36dfa1-54f9-4a11-adf0-5858b8f6959a" />

**Tampilan web sesudah**

<img width="2880" height="1526" alt="Screenshot 2026-11-10 204951" src="https://github.com/user-attachments/assets/8dc56c26-9e03-471f-80b5-ebf2c4d96f56" />

**Database sesudah**

<img width="2880" height="1544" alt="Screenshot 2026-11-10 211848" src="https://github.com/user-attachments/assets/ed9b81ee-7ad0-4279-8811-36456363d6ec" />

**Notifikasi buku sudah disimpan**

<img width="2880" height="1614" alt="Screenshot 2026-11-25 132121" src="https://github.com/user-attachments/assets/d7f09009-f1f5-4561-ab7f-d1cdd7c944b0" />

---

## 3. PUT: Mengubah Data

Tombol **Edit** pada kartu menyimpan buku yang dipilih ke state `editing`, lalu membuka form yang sudah terisi data buku itu. Form yang dipakai sama dengan form tambah. Karena `editing` berisi buku, `handleSubmit` memanggil `updateBook()` yang mengirim `PUT /api/books/:id`. Server memperbarui baris yang sesuai dengan `prisma.book.update()`.

Contoh: buku uji diubah dari tahun 2026 dan genre Fiksi menjadi tahun 2027 dan genre Romantis. Sampul buku ikut berganti ilustrasi sesuai genre barunya.

**Database sebelum**

<img width="2880" height="1544" alt="Screenshot 2026-11-10 211848" src="https://github.com/user-attachments/assets/ced79f2f-1e30-4d97-ab31-c5cd2578bd0d" />

**Form edit buku**

<img width="2876" height="1534" alt="Screenshot 2026-11-10 211728" src="https://github.com/user-attachments/assets/55c3d0db-48a3-444a-b07a-124ac40040de" />

**Database sesudah**

<img width="2880" height="1528" alt="Screenshot 2026-11-10 211751" src="https://github.com/user-attachments/assets/05da55d4-0b4c-40f1-b0fc-0d69f85212d9" />

---

## 4. DELETE: Menghapus Data

Tombol **Hapus** pada kartu hanya menyimpan buku yang dipilih ke state `deleting`, lalu dialog konfirmasi terbuka. Penghapusan baru berjalan setelah pengguna menekan **Hapus buku**. Saat itu `deleteBook()` mengirim `DELETE /api/books/:id`, dan server menghapus baris tersebut dengan `prisma.book.delete()`.

```tsx
async function handleDelete() {
  if (!deleting) return;
  try {
    await deleteBook(deleting.id);
    setDeleting(null);
    showToast("Buku dihapus");
    await muatData();
  } catch (err) {
    setDeleting(null);
    showToast(err instanceof Error ? err.message : "Buku belum terhapus.");
  }
}
```

**Database sebelum**

<img width="2880" height="1528" alt="Screenshot 2026-11-10 211751" src="https://github.com/user-attachments/assets/3571defd-3f64-45a9-be38-d82d32a87601" />

**Dialog konfirmasi**

<img width="2878" height="1554" alt="Screenshot 2026-11-10 211901" src="https://github.com/user-attachments/assets/120368b1-b641-45aa-8933-4c3b153fe0ee" />

**Tampilan web sesudah (muncul notifikasi "Buku dihapus")**

<img width="2880" height="1522" alt="Screenshot 2026-11-10 211910" src="https://github.com/user-attachments/assets/b59b6b22-f5f2-452a-a403-357995856110" />

**Database sesudah**

<img width="2880" height="1506" alt="Screenshot 2026-11-10 211922" src="https://github.com/user-attachments/assets/557c5e2b-2a3c-449f-9f42-74488d6aa0a1" />

---

## 5. Tampilan dengan Tailwind CSS

Tata letak, form, dan tombol ditulis dengan utility class Tailwind. Warna dan font proyek didefinisikan sekali di `client/src/index.css` lewat `@theme`, lalu dipakai sebagai class (`bg-tang`, `text-ink`, `font-display`). Daftar buku memakai grid yang menyesuaikan lebar layar:

```tsx
<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
```

- Layar ponsel menampilkan **2 kolom**.
- Layar yang lebih lebar menampilkan kolom otomatis dengan lebar minimal 190px.

Header dan hero juga menyesuaikan lebar layar dengan awalan `sm:` dan `md:`. Hanya pola dekoratif sampul buku yang ditulis dengan CSS biasa, karena memakai elemen semu (`::before`, `::after`) dan gradien.

**Tampilan ponsel**


<img width="2166" height="1626" alt="Screenshot 2026-11-25 132421" src="https://github.com/user-attachments/assets/fc47a213-08e3-4b6c-90af-3da9457548a5" />
