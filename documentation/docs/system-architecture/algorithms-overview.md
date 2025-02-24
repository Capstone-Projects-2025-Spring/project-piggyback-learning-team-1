---
sidebar_position: 5
---
# Algorithms Overview
## Algorithms Employed
- GenAI Vision Model: Generates MCQs from video content.
- Engagement Scoring: Tracks user interactions to dynamically adjust video recommendations and save metrics to the profile
- Knowledge Retention Algorithm: Uses spaced repetition principles to suggest re-watching or reinforcing material.

### Cross-Cutting Issues
- Error handling: If a video doesn’t load or a quiz fails, the system will catch the error and try again. If it still fails, an error message will be displayed.
- Testing: Testing will be automated to see if videos play, and quizzes work and if the system responds accordingly.


### Flexibility
- VideoManager, QuizManager, and UserProgressTracker are modular components that are separate and can be updated independently. This architecture supports flexibility in case there needs to be modifications set forth by the stakeholders like integrating new quiz formats or switching video providers.
- Using Cloud-based Storage (S3 and DynamoDB) decouples storage from the application logic. We can use additional configurement of our Cloud-based APIs on the AWS Management Console. Furthermore, AWS has a wide range of services in their cloud ecosystem that integrate well with S3 and DynamoDB, should we need to expand or pivot our application.
- Documented change scenarios, such as adapting to different content sources or expanding user tracking features, ensure the system can evolve with future requirements.
