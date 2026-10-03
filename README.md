# Study Terminal — missions & campaign edition

## Open the game

Double-click **index.html** in this folder. Keep the JavaScript, CSS, and assets folder beside it. No installation, account, server, or internet connection is needed for the game.

The original game folder is unchanged. This is a separate improved copy.

## New in this edition

- **Adaptive review:** each source question, math problem, and flashcard gets its own recall history. Misses, guesses, and assisted answers are due in about 10 minutes; confident successes expand to 1, 3, 7, 14, and 30 days. Secure recall requires three confident, unassisted successes across separate local calendar days. Existing missed lists guide selection; detailed item history begins with this edition.
- **5 / 10 / 20-minute missions:** mixed questions, flashcards, and source math, prioritized by due items and mistakes. A miss or guess returns after up to three other items (or sooner near the end), at most once per mission. The timer is a flexible budget, not a deadline. Save & pause stops it.
- **Math coaching:** formula hints, optional source steps, per-field checking, and extra intermediate totals for supported generated mean/weighted-mean problems. Rounding and weighted-average checks offer targeted suggestions where possible; other errors prompt a setup/arithmetic review. Coaching is hidden in timed exams. Step checks award no points; assisted attempts do not count as secure recall.
- **Campaign:** answer five distinct topic questions, pass a six-question checkpoint at 80% or better, then challenge the existing sector boss. Clear all sector bosses for the final campaign challenge. Classic Assault remains unrestricted.
- **Debriefs:** first-attempt accuracy, recovered misses, self-rated flashcard recall, active study time, and a recommended next mission.
- **Phone & offline:** an installable web-app manifest, home-screen icons, and a service worker cache the full game for offline use. Open Phone & offline for installation and backup instructions.

## Earlier improvements

- A redesigned home screen with quick 10-question practice, topic practice, missed-item review, a daily goal, and grouped Study / Play / Focus & tools cards.
- Immediate Guest access, optional named profiles, and an optional intro under Chips & Rank.
- Resume unfinished quizzes, exams, flashcard rounds, cue rounds, and Math Lab entries after reloading. Exam 2 and Exam 3 sessions, missions, and review histories are saved separately.
- Retry missed multiple-choice questions and source math problems together, with feedback after each answer.
- Keyboard controls, clearer focus, accessible mobile navigation and dialogs, larger answer targets, and reduced-motion support.
- Exam 2 practice excludes Exam 3 math generators. Exam timers reject late answers. Partial math entries no longer count as complete answers.
- Speech controls remain hidden when reading is off. All original modes, art, and course content are retained.

## Controls

- Quiz/exam: **1–4** selects the displayed answer. **Enter** advances when focus is on the question or feedback.
- Flashcards: **Space** flips the focused card; **←** marks Again; **→** marks Got it. Reveal before rating.
- **R** reads the current question or flashcard aloud. **[ / ]** adjust speech speed. Voice options are under VOL; available voices depend on your browser/device, and online voices may need internet.
- **Escape** closes the mobile menu and dialogs.

## Keep your existing progress

Progress is stored in your browser, under the same original profile key. Browsers can treat files in different folders as separate storage locations. If your prior progress does not appear:

1. Open your original game in the browser where you studied.
2. Use **Progress & library → Export progress**.
3. Open this improved copy in the same browser and use **Import progress**.

Import into the matching player. An import replaces that player's progress; export the current record first if you want to keep both. Each player has a separate save. No progress is uploaded.

## Phone use

The layout is responsive. A phone must open the HTML in a browser that supports local JavaScript; a file-preview app may not run it. Alternatively, serve this folder on your local network or a static web host. The private hosted edition requires signing in with the owning account on the first online visit. Wait for “Game saved on this device for offline play” before disconnecting. The downloaded folder still opens directly without an account.

## Content and verification

Exam 2 contains **130 MC questions, 331 flashcards, 63 cues, and 34 source math problems**. All 130 MC answer letters match the supplied answer keys; ten representative questions were also checked by answer text. Known point-pay rounding and IQR conflicts, plus source piecework calculations, were verified. See VALIDATION.md.

Real Chrome browser checks covered all 15 mode screens, quiz scoring, mixed math review, save/reload, flashcards, cue persistence, exam expiry, exam switching, keyboard/dialog behavior, and layouts from 320 to 1440 pixels. The tested flows made no network requests. Tests used isolated browser storage, not your real study record.

## Editing the library

`data.json` holds Exam 2 content; `data.js` is the same JSON assigned to `window.STUDY_DATA` so direct file opening works. To update the permanent offline library, keep them synchronized: `data.js` should contain `window.STUDY_DATA = ` followed by the JSON and a semicolon. Importing a library from Progress & library applies it only for the current visit. Exam 3 content remains in `exam3.js`.

## Device storage and installation

There is no automatic cross-device sync. Export progress on one device and import it on the other; this includes adaptive history, campaign checkpoints, and saved missions. Browser cleanup can erase local progress and offline files. Keep an occasional exported backup.

Install behavior follows your browser’s capabilities: [MDN installation guidance](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable). Safari on iPhone/iPad uses Share → Add to Home Screen; compatible Chromium browsers expose Install app. A browser cannot be forced to install an app automatically.
