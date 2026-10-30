# Razhaye Aseman

Front end for an online course site teaching western tropical astrology and practical feng shui. The interface is in Persian (RTL).

Built with React 18, Vite and React Router.

## Getting started

```
npm install
npm run dev
```

The admin panel lives at `/admin`. The password can be changed from its settings tab.

## Current state

There is no backend yet. Courses, reviews, the cart and every uploaded file are stored in the browser (localStorage and IndexedDB), so nothing is shared between visitors. The admin login is checked in the browser as well, which makes it a placeholder rather than real protection.

The courses in `src/data/seed.js` are sample content.

## Still to do

- API and real authentication (admin and students)
- Zarinpal payment: `src/lib/payment.js` is the single place to change
- Server-side storage for videos, PDFs and audio, with access limited to buyers
- Sending the contact and newsletter forms somewhere

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build into `dist`
- `npm run preview` serve the production build locally
