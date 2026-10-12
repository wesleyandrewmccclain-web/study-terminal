# Task: rewrite study-game questions in the professor's multiple-choice style

Read the style guide first: /home/claude/study-terminal/src/QUESTION-STYLE.md

Each input file is a JSON array of questions: {id, topic, prompt, options[], answer (index of the correct option), explanation, source}.
For each input file you are given, write an output file with the SAME name in /home/claude/clean/restyle/out/ containing a JSON array with one object per input question:
  {"id": same id, "prompt": "...", "options": ["...","...","...","..."], "answer": index 0-3, "explanation": "..."}

Rules (strict):
1. Keep every id; one output per input; same order. Valid JSON (UTF-8, use ’ “ ” quotes freely, escape properly).
2. The correct answer must stay the SAME fact as before. Do not change any number, rate, year, threshold, law, name or calculation result. Do not add facts that aren't in the original prompt/options/explanation/source. If the original is a calculation, keep its numbers exactly and only restyle wording/distractors (distractors should be the classic wrong-method numbers already present, or plausible wrong-method results you compute carefully).
3. Exactly 4 options. Convert True/False (2-option) items into 4-option questions.
4. Mix the two professor styles across each file, roughly half and half:
   - Applied scenario: formal HR-professional wording ("An organization…", "An HR analyst discovers…", "A compensation manager…") ending with "Which…?", "What procedure should…?", "Which policy is it following?", "…is called:".
   - Short recall/definition: one sentence ending in "is called:", "are known as:", "Which of the following is not…?".
5. Distractors: at least one absolute/legal-sounding wrong option where it fits ("is always strictly mandated…", "Federal law prohibits…", "automatically eliminates…", "must never…"), plus real-but-wrong course terms from nearby topics. The correct option should read measured and accurate. Don't make the correct answer trivially the only long one every time.
6. Use "None of the answer choices are correct" as an option on roughly 1 in 10 questions (only where it is clearly wrong, or clearly right if the original's answer supports it). When used, put it as the LAST option.
7. Negative stems: write the word in capitals, "NOT" (plain text, no HTML or markdown). Examples go in parentheses "(e.g., …)".
8. Explanation: 1–2 sentences saying why the right answer is right and, if useful, why the tempting distractor is wrong. Keep facts from the original explanation.
9. Do not touch anything else. Do not edit any other files.

When done, reply with only: the files written and the count per file.
