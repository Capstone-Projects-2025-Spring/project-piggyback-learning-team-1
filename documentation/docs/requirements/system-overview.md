---
sidebar_position: 1
---

# System Overview

# Project Abstract

This document outlines a progressive web application designed as a child-friendly interactive video platform. The platform enhances educational engagement by embedding Multiple Choice Questions (MCQs) into videos at strategic timestamps. Users view performance analytics and and interact with educational content in an engaging way. By integrating quizzes into videos, the platform fosters an interactive learning experience, reinforcing comprehension and retention.

## Conceptual Design

The frontend of the application is developed using Next.js, providing a responsive user interface and seamless video playback experience. The application is hosted on Vercel for efficient deployment and scalability. User authentication is implemented to allow personalized progress tracking. The backend, also hosted on Vercel, handles business logic, manages API communications, and interacts with the database. Data is stored in DynamoDB, where user responses, video progress, and performance analytics are recorded. Video content and quiz metadata (such as question prompts and timestamps) are managed through Amazon S3.

## Background

Similar platforms, such as YuJa Video Quizzes and Kaltura Video Quizzes, integrate interactive questions into videos to enhance engagement. YuJa emphasizes real-time interaction, while Kaltura features timeline markers for quiz integration. Our platform builds on these concepts by extending interactive quizzes beyond strictly educational content, making it a versatile tool for various age groups and content types. The system’s emphasis on seamless user experience, personalized tracking, and data-driven insights distinguishes it from existing solutions.
