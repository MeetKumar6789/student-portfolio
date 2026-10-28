# Practical 10 Report

## 1. Aim
To extend the student portfolio website by implementing asynchronous processing and an event-driven architecture. The project demonstrates how a UI interaction can emit events, trigger async work, and update the interface on started, success, and failure states.

## 2. Problem Statement
The original portfolio had a standard contact form and static portfolio sections, but it did not demonstrate asynchronous workflows or event-driven communication. Modern applications often need to validate input, process work in the background, and monitor operational events without freezing the interface. This practical solves that by creating a simple browser-level event-driven system.

## 3. Theory
Asynchronous processing allows the application to continue responding while time-consuming tasks run in the background. In JavaScript, async/await and Promise-based delays are used to handle this elegantly. Event-driven architecture adds loosely coupled communication between producers and consumers. In this project, the contact form and GitHub fetch service act as producers, while the UI and event monitor act as consumers.

## 4. Software and Hardware Requirements
- Operating system: Windows 10 or newer
- Node.js 18+
- npm
- Vite
- Modern browser with DevTools
- Internet access for GitHub API requests

## 5. System Architecture
The architecture is a client-side React app with a custom event bus and service layer. The contact form emits events, the async service simulates processing, and the event monitor listens to recent updates. The GitHub fetch flow follows the same principle through started, completed, and failed events.

## 6. Algorithm or Workflow
1. The user enters data in the contact form.
2. The form emits the CONTACT_FORM_SUBMITTED event.
3. Validation runs in the async service layer.
4. The service emits MESSAGE_PROCESSING_STARTED.
5. A delay-based Promise simulates background processing.
6. On success, MESSAGE_PROCESSING_COMPLETED is emitted.
7. On failure, MESSAGE_PROCESSING_FAILED is emitted.
8. The event monitor and UI respond to these events.
9. GitHub repository fetching follows the same pattern with fetch() and AbortController support.

## 7. Implementation Details
- Event bus implementation: src/services/eventBus.js
- Contact processing: src/services/contactService.js
- GitHub fetch: src/services/githubService.js
- Event monitor hook: src/hooks/useEventMonitor.js
- Event monitor UI: src/components/EventMonitor.jsx
- Contact form flow: src/components/Contact.jsx
- GitHub repository flow and retry logic: src/components/Projects.jsx

The project keeps the existing portfolio pages and adds event-driven features without changing the overall app structure.

## 8. Source Code References
- App router: src/App.jsx
- Navigation: src/components/NavBar.jsx
- Contact form: src/components/Contact.jsx
- Event monitor: src/components/EventMonitor.jsx
- Repository dashboard: src/components/Projects.jsx
- Event bus: src/services/eventBus.js
- Async contact logic: src/services/contactService.js
- GitHub integration: src/services/githubService.js

## 9. Execution Steps
1. Install dependencies using npm install.
2. Start the project with npm run dev -- --host 0.0.0.0.
3. Open http://localhost:5173/.
4. Navigate to Contact and submit a valid message.
5. Enable the failure simulation and submit a second message.
6. Navigate to Event Monitor and review the recent event history.
7. Open the Projects page and observe GitHub repository loading.
8. Open browser DevTools and inspect the Network tab.
9. Run npm run build to verify production compilation.

## 10. Test Cases and Expected Results
### Test 1: Valid Contact Submission
Expected: MESSAGE_PROCESSING_STARTED and MESSAGE_PROCESSING_COMPLETED events appear and the success message is displayed.

### Test 2: Invalid Contact Submission
Expected: Validation message is shown and MESSAGE_PROCESSING_FAILED is emitted.

### Test 3: Simulated Failure
Expected: Failure checkbox triggers a simulated outage message and emits the failed event.

### Test 4: Repository Loading
Expected: GitHub data loads in a loading state, then success state.

### Test 5: Retry After Error
Expected: Retry button retries the request and updates state.

### Test 6: Build Verification
Expected: npm run build completes successfully and outputs the dist folder.

## 11. Observations
The event-driven design makes the code easier to trace and debug. The user interface remains responsive because each operation runs asynchronously instead of freezing the browser. The event monitor helps students understand how events are created and consumed in a real-world frontend architecture.

## 12. Screenshots Checklist
- Home page landing screen
- Contact form with valid submission message
- Contact form with validation and failure simulation
- Event monitor showing recent events
- Projects page with repository search and loading state
- DevTools Network tab showing the GitHub request
- Final production build confirmation from the terminal

## 13. Result
The portfolio was successfully extended with asynchronous processing and event-driven architecture. It demonstrates async workflows, events, retries, validation, and live monitoring in a clean, educational style.

## 14. Conclusion
This practical helps connect fundamental web programming concepts to event-driven design. The portfolio remains functional and easy to understand, while also providing a clear demonstration of how asynchronous work and event subscriptions are handled in a browser-based application.
