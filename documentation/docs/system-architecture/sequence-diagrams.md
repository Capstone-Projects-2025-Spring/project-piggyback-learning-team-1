---
sidebar_position: 2
---
# Sequence Diagrams
## Use Case 1 - User Browses Videos
*As a user, I want to browse available videos*
1. From visiting the website homepage, user browses the selection of available videos on various topics
2. User can roll over video to view description of content
3. User selects a video by clicking on the icon

<div align="center">

![SD1](/img/SD1.png)

</div>

## Use Case 2 - User Customizes Their Learning Experience
*As a user, I want to customize my video questions*
1. User is prompted to customize questions from a switchboard menu by clicking on highlighted icons
2. Users can enable Object Detection Questions, change Subject Focus, and indicate Penalty Options
2. User clicks the "Start Learning" icon in the lower left corner to begin playing the video

<div align="center">

![SD2](/img/SD2.png)

</div>

## Use Case 3 - User Answers a Multiple Choice Question
*As a user, I want to answer the question to continue the video*
1. Video pauses automatically
2. Question based on the current video content pops up and reads outloud
3. Set of multiple choice options pop up under question
4. Video does not play until question is answered or skipped
5. User selects an answer by clicking on it

<div align="center">

![SD3](/img/SD3.png)

</div>

## Use Case 4 - After answering the MCQ quiz question, there are three possible outcomes

### Outcome 1 - User Answers Incorrectly
1. User receives notification of incorrect answer
2. Video rewinds back to last checkpoint
3. After reaching the initial checkpoint, user is reprompted the same question and receives a hint about the correct answer
4. User answers question again, either repeating incorrect process or moving to correct process

<div align="center">

![SD4Inc](/img/SD4Inc.png)

</div>


### Outcome 2 - User Answers Correctly
1. User receives confirmation of correct answer
2. Explanation of the question is given
3. Option button to continue the video pops up

<div align="center">

![SD4Cor](/img/SD4Cor.png)

</div>

### Outcome 3 - User Skips Question
*As a user, I want to skip this question after answering incorrectly before*
1. User can opt to skip a question by pressing the "Skip Question" option after answering the question at least twice
2. Explanation of the question is given
3. Option button to continue the video pops up

<div align="center">

![SD4Skip](/img/SD4Skip.png)

</div>

## Use Case 5 (Optional) - User Answers an Object Detection Question
*As a user, I indicated in the Learning Experience that I wanted to also answer object detection questions*
1. Video pauses automatically
2. Question asks user to identify an object on screen by clicking on it
3. Video does not play until question is answered or skipped
4. User selects the answer by clicking on the screen or skipping the question

<div align="center">

![SD5](/img/SD5.png)

</div>

## After answering the question, the linear process resumes

## Use Case 6 - User Continues the Video
*As a user, I want to continue the video*
1. Video resumes after pressing the "Continue Watching" button
2. Question process repeats every few minutes of the video until end

<div align="center">

![SD6](/img/SD6.png)

</div>


## Use Case 7 - User Reviews Session Recap 
*As a user, I want to review my session metrics*
1. Video ends and summury of session pops up including questons answered correctly, incorrectly, hints used, and total time
2. Option to exit back to main menu is presented

<div align="center">

![SD7](/img/SD7.png)

</div>

# Metrics View


## Use Case 8 - User uses predetermined pin to switch to Metrics Mode
*As a Researcher, I want to view the progess metrics for the program*
1. User presses the "Switch" icon to switch to Metrics Mode
2. Applicaion prompts user to input predetermined pin
3. Once pin is approved, mode switches from "Student" to "Metrics" mode
4. Program metrics populate on screen

<div align="center">

![SD8](/img/SD8.png)

</div>


## Use Case 9 - User exports metrics
*As a Researcher, I want to export the data for all metrics in the system*
1. User clicks on "Export Metric" button
2. Metrics spreadsheet is downloaded to the User's device

<div align="center">

![SD9](/img/SD9.png)

</div>