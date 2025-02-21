---
sidebar_position: 2
---

## User interaction with Database Sequence Diagram
This sequence diagram illustrates how the web app handles video playback and quiz interactions:
<ul>
        <li>Video Playback Flow</li>
                <ul>
                        <li>User selects a video, triggering the VideoManager to fetch it from the YouTube API.</li>
                        <li>The video is played, with automatic pauses at predefined timestamps.</li>
                </ul>
        <li>Quiz Retrieval and Display</li>
                 <ul>
                        <li>On pause, the VideoManager requests a quiz from the QuizManager, which retrieves multiple-choice questions (MCQs) from S3.</li>
                        <li>The video is played, with automatic pauses at predefined timestamps.</li>
                </ul>
        <li>Answer Validation and Progress Tracking</li>
                <ul>
                        <li>User submits answers to the quiz, and the QuizManager uses AWS Lambda to validate them.</li>
                        <li>Results are sent back to the user and passed to the UserProgressTracker, which saves the score to DynamoDB.</li>
                </ul>
</ul>
<div align="center">

![SD1](/img/SD1.png)

</div>

## User Mode Sequence Diagram
The user starts by selecting a language, which updates the site (but not video audio).
After selecting a video, the user chooses:
- Question Difficulty (Beginner/Intermediate/Advanced).
- Question Frequency (Not Often/Often/Very Often).
The video begins, pausing periodically for questions.
- Questions are fetched from the database and presented as MCQs.
- The answer validation happens, with either a correct/incorrect response.
- The user can retry or skip (if allowed), and the video resumes until the end.

At the end, a Question Log shows all questions from the session.
<div align="center">

![SD2](/img/SD2.png)

</div>


## Instructor View Sequence Diagram
- Instructor presses the switch icon, and the app prompts for a PIN.
- The PIN is validated against the database, and if approved, the mode switches to Teacher Mode.
Change Learning Goal:
- The instructor selects a new learning goal, and the app updates this information in the database.
View Question History:
- The instructor views past questions and answers, fetched from the database.
- They can discard or flag questions for future review.
Deactivate Program:
- The instructor selects the deactivate option, confirms it, and the app updates the database to deactivate the student’s program.

<div align="center">

![SD3](/img/SD3.png)

</div>
