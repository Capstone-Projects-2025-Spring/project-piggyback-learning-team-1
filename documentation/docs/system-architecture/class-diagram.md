---
sidebar_position: 1
---
# Class Diagram
These two class diagrams shows our main two pages and their core components:

## Home Page
- Homepage: Displays informaton for user to view and interact with
- Video: Previews video descriptions and thumbnails
- PreferencesDialogue: Allow user to customize learning experience
- PinLockPage: Unlock metrics for research viewing
- ExternalComponents: UI styling

<div align="center">

![HomeClass](/img/HomeClass.png)

</div>

## Quiz Page
- DetectLabels: Manages video playback, handles interactions from plays, pauses, and answering quizzes
- Props: Handles quiz operations, retrieves MCQs from S3, submits answers, and calculates scores.
- QuizSystem: Evaluates user quiz answers, records each quiz attempt
- MediaCapture: Capture frames for quiz question generation
- UIManager: Renders and displays information for user
- ExternalServices: Interacts with MongoDB to store scores and retrieve progress.

<div align="center">

![QuizClass](/img/QuizClass.png)

</div>






