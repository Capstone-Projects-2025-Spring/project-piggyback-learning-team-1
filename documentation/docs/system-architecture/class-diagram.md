---
sidebar_position: 1
---
# Class Diagram
This class diagram shows the core components and their interactions for your educational website:
- VideoManager: Manages video playback, fetches from YouTube, plays, pauses, and requests quizzes.
- QuizManager: Handles quiz operations, retrieves MCQs from S3, submits answers, and calculates scores.
- UserProgressTracker: Tracks and saves user progress, and interacts with DynamoDB to store scores and retrieve progress.

<div align="center">

![ClassDiagram](/img/ClassDiagram.png)

</div>




