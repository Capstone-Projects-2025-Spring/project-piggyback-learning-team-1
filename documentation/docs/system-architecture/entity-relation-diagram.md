---
sidebar_position: 3
---

# Entity-Relation Diagram
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