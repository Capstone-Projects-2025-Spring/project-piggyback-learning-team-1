---
sidebar_position: 1
---

# Design Document - Part I Architecture

## Class Diagram
This class diagram shows the core components and their interactions for your educational website:
- VideoManager: Manages video playback, fetches from YouTube, plays, pauses, and requests quizzes.
- QuizManager: Handles quiz operations, retrieves MCQs from S3, submits answers, and calculates scores.
- UserProgressTracker: Tracks and saves user progress, and interacts with DynamoDB to store scores and retrieve progress.

<div align="center">

![ClassDiagram](/img/ClassDiagram.png)

</div>

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


## Entity-Relation Diagram
USER Table:
- Contains basic user info like userId, username, and email.
- userId acts as the primary identifier.

PROGRESS Table:
- Tracks each user's interaction with videos.
- Contains progressId (unique record ID), userId (foreign key referencing the USER table), videoId (foreign key referencing the VIDEO table), a quiz score, and a timestamp for when the progress was recorded.

VIDEO Table:
- Holds information about each video ,videoId (primary key), title, and url to the YouTube video.
Relationships:
- One user can have multiple progress entries (one for each video they’ve interacted with).
- Each progress entry connects a USER to a VIDEO via foreign keys.
- This setup queries what videos a user watched and how they performed on each quiz.

<div align="center">

![SD3](/img/Entity_RelationD.png)

</div>

### Algorithms Employed
- GenAI Vision Model: Generates MCQs from video content.
- Engagement Scoring: Tracks user interactions to dynamically adjust video recommendations and save metrics to the profile
- Knowledge Retention Algorithm: Uses spaced repetition principles to suggest re-watching or reinforcing material.
### Development Environment
- IDE: Visual Studio Code
- Compilers/Transpilers: Node.js, TypeScript
- Editors: VS Code with ESLint
- Test Tools: Jest
### Version Control
Tool: 
- Git

Procedures:
- Main branch for production-ready code.
- Feature branches for new functionality.
- Pull requests and code reviews before merging.
- Will create a new release at the end of each sprint for rollback if needed and for shareability


### Cross-Cutting Issues
- Error handling: If a video doesn’t load or a quiz fails, the system will catch the error and try again. If it still fails, an error message will be displayed.
- Testing: Testing will be automated to see if videos play, and quizzes work and if the system responds accordingly.

### Alternative Architectures
Currently, our architecture utilizes several serverless cloud tools to facilitate our application workflow. Our class diagram is also shown at the top of this document detailing our class managers for video, quizzes, and users.

In the case that our application architecture needs to pivot, we briefly provide below alternative architectures
<ul>
        <li>Architectures</li>
                <ul>
                        <li>Monolithic: A single application to handle all functions, with one Node.js backend, a database such as MySQL, and Next.js frontend.</li>
                </ul>
        <li>Tools</li>
                <ul>
                        <li>Frameworks: Vue.js, React.js, Gatsby, HTML Static Site</li>
                        <li>Storage: Other storage APIs such as Firebase may provide us with features that AWS does not currently support</li>
                </ul>
</ul>
Our non-functional requirements are detailed on our Docusaurus page.


### Flexibility
- VideoManager, QuizManager, and UserProgressTracker are modular components that are separate and can be updated independently. This architecture supports flexibility in case there needs to be modifications set forth by the stakeholders like integrating new quiz formats or switching video providers.
- Using Cloud-based Storage (S3 and DynamoDB) decouples storage from the application logic. We can use additional configurement of our Cloud-based APIs on the AWS Management Console. Furthermore, AWS has a wide range of services in their cloud ecosystem that integrate well with S3 and DynamoDB, should we need to expand or pivot our application.
- Documented change scenarios, such as adapting to different content sources or expanding user tracking features, ensure the system can evolve with future requirements.

