---
sidebar_position: 3
---

# Class Diagram of MongoDB

<b>Figure 2.</b> High level design of the MongoDB quiz database for the Piglet Prep application.

<div align="center">

![MongoDBClass](/img/MongoDBClass.png)

</div>

### For our video learning platform with dynamic quizzing, a class diagram was more appropriate than an entity relationship diagram for a few reasons.

### 1. Hierarchical structure of quiz data 
The class diagram maps directly to the JSON structure we are using to exchange data with the MongoDB API. It clearly shows the hierarchical structure of our quiz data, such as attempts containing metrics containing hints.

### 2. Object relationships and data structures
Since our system relies heavily on many different shifting components, the class diagram better reflects how our application processes and interacts with the data.