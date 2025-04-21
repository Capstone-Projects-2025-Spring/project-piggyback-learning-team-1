---
sidebar_position: 4
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

  <li>The video will pause when the user receives the question</li>

  <li>Question will automatically be read out loud</li>

  <li>
    The video will rewind if an incorrect answer is selected; the same incorrect answer cannot be selected twice
    <ul>
      <li>User should be able to rewind the video if they are unsure about the answer</li>
    </ul>
  </li>

  <li>Users shall have the option to skip the question</li>

  <li>
    Users will receive a recap at the end of the video that includes explanations for correct and incorrect answers
    <ul>   
      <li>Users will see a summary of their correct and incorrect responses</li>
    </ul>
  </li>
</ul>

## Nonfunctional Requirements
<ul>
  <li>Data analytics on each user session will be accessible to users</li>

  <li>
    Questions and videos must be able to load efficiently to ensure a seamless user experience
    <ul>
      <li>The system should be able to load within 5ms</li>
    </ul>
  </li>
</ul>

## Operating Costs

<div align="center">

![APICosts](/img/APICosts.png)

</div>
