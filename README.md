# Project 1 - Screenshot API Tool

I built a Screenshot API tool with a React.js (TypeScript) frontend that offers features like setting custom viewports, selecting devices, and capturing full-page screenshots. The backend is powered by Node.js, Express, and Puppeteer to handle screenshot generation. For development, I used Vite and kept both the frontend and backend in a single project structure for simplicity, given the lightweight backend requirements. Additional tools include CORS for API handling and Lucide React for icons.

# Instruction to run the app

1. Step 1: Install the dependencies using the command below

```
pnpm install
```

or

```
npm install
```

2. Step 2: open terminal and run the following command to run the app

#### Run backend

```
node api/main.ts
```

#### Run front end

```
pnpm dev
```

of

```
npm run dev
```

## Objective

Build a tool that takes a website URL and returns a screenshot of that page.

---

## Instructions

### 1. `scrape.js` – Screenshot Function

- Create a file named `scrape.js` (or use another appropriate file name).
- This file should export a function that:
  - Takes a **URL** as input.
  - Opens the URL in a **headless browser**.
  - Takes a **screenshot** of the full page.
  - Returns or saves the screenshot.
- The function should be **reusable from other files** (e.g., it will be called from `main.js`).

---

### 2. `main.js` – API Server

- Create a file named `main.js`.
- Use **Express**, **Fastify**, or **Hono** to build a simple server.
- Create a **GET or POST** API endpoint (e.g., `/screenshot`).

#### The API should:

- Take a **URL** from the request (either query parameter or request body).
- Use the function from `scrape.js` to take a screenshot.
- Return the **screenshot** in the response (as an image or downloadable file).

---

### 3. Bonus: Customization Features

Allow the user to change the following settings via query parameters or request body:

- `width` – width of the browser viewport
- `height` – height of the browser viewport
- `device` – device type (`mobile`, `tablet`, `desktop`)

---
