# iTunes Search Favourites

A full-stack React and Express application that allows users to search the iTunes Store and Apple Books, view media results, and manage a temporary favourites list.

## Purpose

This project demonstrates a simple full-stack application where:

- React handles the user interface.
- Express handles backend API requests.
- The backend communicates with the iTunes Search API.
- JWT middleware secures the backend search route.

No user authentication or database is required. Favourites are stored only in React state and are cleared when the user refreshes or leaves the app.

## Key Features

- Search the iTunes Store and Apple Books.
- Filter searches by media type, including movie, podcast, music, audiobook, TV show, software, ebook or all.
- Display results using responsive Bootstrap cards.
- Show content name, artist name, artwork and release date.
- Add items to a favourites list.
- Remove items from the favourites list.
- Use JWT to authorise access to the backend search route.
- Use Axios on the Express backend to call the iTunes Search API.

## How to Run Locally

Open the project in VS Code.

### Backend

In a terminal:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```txt
http://localhost:5000
```

The backend requires a `.env` file inside the `backend` folder:

```env
PORT=5000
ACCESS_TOKEN_SECRET=your_long_random_secret
NODE_ENV=development
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Usage

1. Start the backend.
2. Start the frontend.
3. Open the frontend in the browser.
4. Enter a search term.
5. Select a media type.
6. Click search.
7. Add or remove favourites from the results.
