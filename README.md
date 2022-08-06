# Exa

![](/public/img/admin-menu.png)

![](/public/img/test-view.png)

**Exa** - a web application designed to serve as a platform to create and administer online tests/examinations. The tests (refered to as 'courses') are made up of sets of questions that are randomly selected and used to assess a user/student over a predefined period of time.

Each course has a name (which must be unique), a title, a release date, sets of questions, duration, and optionally even a password. Once a course is started, a countdown to the maximum time allowed is started, and answers are submitted to the backend server in real time. When the time is exhausted, the course will be automatically submitted and the session will be ended. User can leave an active course and resume later, however, the timer won't be stopped.

*Exa* also has a dashboard that's accessible only to admin users. It has features like course creation, course management, user management, and an event logs page for viewing event logs.

This is the front-end code for the program, which was made using Svelte. The backend code can be found [here](https://github.com/4g3nt47/exa-backend)

## Installation

1. Clone the repo

```bash
git clone https://github.com/4g3nt47/exa-frontend.git
cd exa-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```bash
VITE_EXA_API=<URL_OF_EXA_API>
```

4. Start the dev server

```bash
npm run dev
```

Or create a production build;
```bash
npm run build
```
