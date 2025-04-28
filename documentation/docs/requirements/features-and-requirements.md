---
sidebar_position: 3
---

# Features and Requirements

## Functional Requirements
<ul>
  <li>
    Users will be able to receive multiple choice questions at critical points
    <ul>
      <li>Questions will be related to the video to guide and enhance story comprehension</li>
      <li>Questions will be generated using a large language model and an object detection model</li>
      <li>Quiz questions will include varied interaction types (text-based, image-based, touch-based)</li>
    </ul>
  </li>

  <li> Users will be able to customize their learning experience</li>
    <ul>
      <li>Special Object Detection Questions can be enabled in addition to regular MCQ questions</li>
      <li>Each video session must have a Subject Focus(s) for the questions: Mathematical, Nature, or Animal focus</li>
      <li>Penalty Options for wrong answers can either be having the video rewind, or auto skipping the question</li>
    </ul>

  <li>The video will pause when the user receives the question</li>

  <li>Question will automatically be read out loud</li>

  <li>Users shall have the option to skip the question</li>
  <li>After answering incorrectly, users cannot reselect options that they have previously selected</li>

  <li>
    Users will receive a session recap at the end of the video 
    <ul>   
      <li>Users will see a summary including total correct and incorrect answers, hints used, and total time spent answering questions</li>
    </ul>
  </li>
  <li>Users can view aggregate user metrics across all sessions using a PIN</li>
  <li>Users can export aggregate metrics for research purposes</li>
</ul>

## Nonfunctional Requirements
<ul>
  <li>Data analytics on aggregated user sessions data will be accessible to users</li>
  <li>
    Questions and videos must be able to load efficiently to ensure a seamless user experience
    <ul>
      <li>The system should be able to load within 5ms</li>
    </ul>
  </li>
</ul>

## Operating Costs

