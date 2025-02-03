---
sidebar_position: 1
---

# System Overview

## 1. Project Introduction
This website is a child-friendly video platform designed to offer interactive educational content. Videos are enhanced with embedded Multiple Choice Questions (MCQs) to engage children and assess their understanding as they watch. The system allows users to sign in, track their progress, and review performance analytics.

## 2. System Description
The platform is hosted on Vercel using a Next.js application for the front-end. Videos are embedded with 3-5 MCQs triggered at specific timestamps. User interactions, such as answering questions, are tracked and stored in DynamoDB, with media and question data managed via Amazon S3.

### Key Features:
- **User Authentication:** Allows users to sign in and save their progress.
- **Interactive Videos:** Periodic MCQs pop up to test comprehension.
- **Progress Tracking:** Stores user responses and performance after each video.
- **Data Analytics:** Tracks user performance metrics like correctness and attempts.

## 3. System Block Diagram Components

![System_Block_Design_V1](https://github.com/user-attachments/assets/b3c291db-bf45-4f3b-8015-febfc8636a4f)

### Front-End (Next.js Application):
- **User Interface:** Displays videos, MCQs, and result screens.
- **Event-Driven MCQs:** MCQs appear at predefined video timestamps (fetched from S3).
- **User Authentication:** Handles sign-in and session management.

### Back-End (Hosted on Vercel):
- **Business Logic:** Manages video playback events, triggers MCQs, and handles data interactions with DynamoDB.
- **API Communication:** Facilitates data flow between the front-end and back-end services.

### Database (DynamoDB):
- **User Data Storage:** Saves user profiles, video progress, and quiz performance.
- **Analytics Generation:** Computes metrics like the percentage of correct/incorrect answers and attempts.

### Storage (Amazon S3):
- **Media Storage:** Hosts video content and MCQ metadata (in JSON format).
- **Question Metadata:** Includes details like question ID, text, and timestamp for triggering during video playback.

## 4. Interfaces Between Components
- **Front-End ↔ S3 Bucket:** Retrieves video content and MCQ JSON files.
- **Front-End ↔ DynamoDB (via API):** Sends user quiz responses and requests progress data.
- **Back-End ↔ DynamoDB:** Handles data queries for user performance and analytics.

## 5. Data Flow
1. **User Login:** Authenticated via the front-end.
2. **Video Playback Starts:** Video content streamed from S3.
3. **MCQ Trigger:** Front-end fetches questions from S3 based on predefined timestamps.
4. **User Interaction:** User answers the MCQ; results are shown (correct/incorrect).
5. **Data Storage:** Answer results are sent to DynamoDB, linked to the user’s ID.
6. **Progress Retrieval:** System pulls analytics from DynamoDB to display performance metrics.

## 6. Compatibility and Integration
- **Cloud-Ready:** Hosted on Vercel for easy scalability.
- **AWS Services Integration:** Utilizes S3 for media storage and DynamoDB for fast, flexible database management.
- **Responsive Design:** Ensures smooth performance on desktops, tablets, and smartphones.
