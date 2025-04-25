---
sidebar_position: 4
---
# User Use Case Descriptions
## Use Case 1 - User Browses Videos
*As a user, I want to browse available videos*
1. From visiting the website homepage, user browses the selection of available videos on various topics
2. User can roll over video to view description of content
3. User selects a video by clicking on the icon

## Use Case 2 - User Plays Video
*As a user, I want to start watching my content*
1. User is redirected to a seperate page
2. User clicks the "Play" icon in the lower left corner

## Use Case 3 - From here, users will be displayed one of two potential question types
### Question Type A - User Answers a Multiple Choice Question
*As a user, I want to answer the question to continue the video*
1. Video pauses automatically
2. Question based on the current screen pops up
3. Set of multiple choice options pop up under question
4. Time pops up in corner counting down time
5. Video does not play until question is answered or timer runs out
6. User selects an answer by clicking on it


### Question Type B - User Answers an Object Detection Question
*As a user, I want to answer the question to continue the video*
1. Video pauses automatically
2. Question prompts user to click on screen and identify an object
3. Time pops up in corner counting down time
4. Video does not play until question is answered or timer runs out
5. User select the answer by clicking on the screen

## Use Case 4 - After answering the quiz question, there are four possible outcomes

### Outcome 1 - User Answers Incorrectly
1. User receives notification of incorrect answer
2. Video rewinds back to last checkpoint
3. User receives hint about correct answer
4. User answers question again, either repeating incorrect process or moving to correct process


### Outcome 2 - User Answers Correctly
1. User receives confirmation of correct answer
2. Explanation of the question is given
3. Option button to continue the video pops up

### Outcome 3 - User Skips Question
*As a user, I want to skip this question after answering incorrectly before*
1. User can opt to skip a question by pressing the "Skip Question" option after answering the question at least once
2. Explanation of the question is given
3. Option button to continue the video pops up


### Outcome 4 - Question Times Out
*As a user, I did not answer this question in time*
1. Video rewinds back to last checkpoint
2. User receives hint about correct answer
3. User answers question again, either repeating incorrect process or moving to correct process

## After answering the question, the linear process resumes

## Use Case 5 - User Continues the Video
*As a user, I want to continue the video*
1. Video resumes after pressing the continue button
2. Question process repeats every few minutes of video until end


## Use Case 5 - User Reviews Session Recap 
*As a user, I want to review my session metrics*
1. Video ends and summury of session pops up including questons answered correctly, incorrectly, hints used, and total time
2. Option to exit back to main menu is presented