# Student Portfolio - Practical 10

## Practical Title
Student Portfolio – Meet Nakarani: Implementing Asynchronous Processing with Event-Driven Architecture

## Aim
The aim of this practical is to extend the existing student portfolio with asynchronous processing and event-driven design. The portfolio demonstrates how form submission, simulated work queues, and GitHub repository fetching can be coordinated through a browser event system without blocking the user interface.

## Problem Definition
Modern web applications often need to handle background work such as validation, API requests, queue processing, and completion/error flows. If these tasks are written directly into UI logic, the interface becomes harder to maintain and debug. This practical solves that problem by separating event producers from event consumers and by processing asynchronous work with promises and async/await.

## Architecture Overview
The application keeps the original React portfolio structure and adds a lightweight event service, asynchronous service layer, and a live event monitor. The flow is:

1. A user action happens in the UI.
2. A component emits a domain event.
3. An async service performs work with try/catch/finally.
4. The service emits a started, success, or failed event.
5. The event monitor and UI update using the latest state.

This creates a beginner-friendly event-driven pattern without introducing a backend message broker.

## Asynchronous Processing
The contact form simulates asynchronous processing using a Promise-based delay and async/await. Instead of blocking the page, the UI updates to show a loading state, then success or failure messages. The same pattern is used for GitHub repository loading, where fetch requests are executed asynchronously and tracked with loading, empty, success, and error states.

## Event-Driven Architecture
This project uses a custom event bus built in JavaScript. Components emit events such as CONTACT_FORM_SUBMITTED and REPOSITORIES_FETCH_STARTED, and the monitor listens to those events. This decouples the producers (form and service logic) from consumers (UI feedback and event dashboard).

## Event Names and Their Purpose
- CONTACT_FORM_SUBMITTED: User submits the contact form.
- MESSAGE_PROCESSING_STARTED: Simulated contact-processing begins.
- MESSAGE_PROCESSING_COMPLETED: Async task succeeds.
- MESSAGE_PROCESSING_FAILED: Validation or processing fails.
- REPOSITORIES_FETCH_STARTED: Repository request begins.
- REPOSITORIES_FETCH_COMPLETED: GitHub repositories were retrieved successfully.
- REPOSITORIES_FETCH_FAILED: Repository request failed or rate-limited.

## Component and Service Responsibilities
- App.jsx: Root router and route-level layout.
- Contact.jsx: Handles form submission, validation, async queue simulation, and user feedback.
- Projects.jsx: Fetches GitHub repositories and keeps task-manager and repo UI states.
- EventMonitor.jsx: Displays a live recent event log.
- useEventMonitor.js: Subscribes to the bus and stores recent entries.
- eventBus.js: Central event-dispatch service and in-memory event history.
- contactService.js: Validates contact input and simulates async processing.
- githubService.js: Fetches repository data with async/await and AbortController support.

## Project Structure
```text
student-portfolio/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── api.js
│   ├── components/
│   │   ├── Contact.jsx
│   │   ├── EventMonitor.jsx
│   │   ├── Projects.jsx
│   │   ├── NavBar.jsx
│   │   └── ...
│   ├── hooks/
│   │   └── useEventMonitor.js
│   └── services/
│       ├── eventBus.js
│       ├── contactService.js
│       └── githubService.js
├── reports/
│   └── practical-10-report.md
├── README.md
├── package.json
└── index.html
```

## Installation and Execution
### Prerequisites
- Node.js 18 or newer
- npm

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev -- --host 0.0.0.0
```

Open the application in the browser at:
```text
http://localhost:5173/
```

### Production build
```bash
npm run build
```

## Practical Demonstration
1. Start the Vite server with the command above.
2. Open the portfolio and visit the Contact page.
3. Submit a valid message and observe the CONTACT_FORM_SUBMITTED, MESSAGE_PROCESSING_STARTED, and MESSAGE_PROCESSING_COMPLETED events.
4. Tick the failure simulation option and submit another valid message to trigger MESSAGE_PROCESSING_FAILED.
5. Visit the Event Monitor page to review the latest event history.
6. Go to the Projects page to trigger the GitHub repository fetch.
7. Observe loading, success, retry, and empty/error states.
8. Open browser DevTools and inspect the Network tab for the GitHub API request.
9. Run npm run build to confirm the app still compiles to production assets.

## Testing Procedure
- Check the Contact form with valid input.
- Check the Contact form with invalid input.
- Check the Contact form when failure simulation is enabled.
- Check the Projects page during repo loading and when the network fails.
- Check the Event Monitor page for recent event entries.
- Validate that the app still builds with npm run build.

## Expected Results
- The contact form responds asynchronously without blocking the interface.
- Event names appear in the order expected by the workflow.
- Error messages feel user-friendly and do not crash the page.
- GitHub repository data loads gracefully and supports retry.
- The event monitor keeps a recent, limited history of activity.

## Limitations of Simulated Processing
This practical deliberately simulates the back-end work instead of sending real emails or connecting to a production queue. That keeps the exercise safe, beginner-friendly, and suitable for a practical exam. In a production application, the real system would connect to an email service, queue worker, or event broker.

## Conclusion
Practical 10 demonstrates how asynchronous actions and event-driven messaging can be modelled in a frontend application. The final portfolio remains visually consistent with the original project while teaching a clear, maintainable pattern for async operations, event handling, and real-time monitoring.
