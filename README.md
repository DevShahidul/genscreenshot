# Project 1 - Screenshot API Tool

## Submission Deadline: 25th May 6:00 PM

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

## Notes
- If you choose to use **Next.js**, make sure to:
  - Place the `scrape.js` file in an appropriate location.
  - Mention the **file path** of `scrape.js` when submitting the assignment.
- You can also use any other suitable file type, i.e., mjs, ts, etc.
