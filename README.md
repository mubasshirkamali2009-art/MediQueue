# MediQueue

**Live Site:** [https://mediqueue-pied.vercel.app/](https://mediqueue-pied.vercel.app/)
server site live link : https://medi-queue-server-psi.vercel.app/
clint site githun repo link: https://github.com/mubasshirkamali2009-art/MediQueue.git
server site github repo link:https://github.com/mubasshirkamali2009-art/meddique-sarver.git
MediQueue is a tutor booking platform that connects students with subject experts. Browse tutors by subject, check availability, and book a session in just a few clicks.

## Features

- **Smart Tutor Discovery** — Browse all available tutors or filter instantly by subject category (Math, Physics, Computer Science, and more) right from the homepage.
- **One-Click Session Booking** — View a tutor's full profile (schedule, fee, institution, available slots) and book a session without any back-and-forth.
- **Personal Dashboard for Tutors** — Logged-in users can list themselves as a tutor, then manage, edit, or delete their own tutor profiles from a dedicated "My Tutors" page.
- **Booking Management** — Students can track all their booked sessions and cancel a booking directly from "My Booked Sessions," with real-time status updates (Pending, Confirmed, Cancelled).
- **Secure Authentication** — Sign up and sign in with email/password or Google OAuth, with protected routes that redirect unauthenticated users automatically.
- **Light & Dark Mode** — A polished, accessible UI that adapts across the entire app, from the navbar to booking tables, for comfortable viewing day or night.
- **Responsive Design** — Fully usable experience across desktop, tablet, and mobile, including a dedicated mobile navigation menu.

## Tech Stack

**Frontend:** Next.js, Tailwind CSS, HeroUI, DaisyUI
**Backend:** Express.js, MongoDB

## Getting Started (Local Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd mediqueue

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app. Make sure the backend server is also running (default: `http://localhost:5000`) for tutor and booking data to load correctly.