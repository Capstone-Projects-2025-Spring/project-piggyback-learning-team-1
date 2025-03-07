---
sidebar_position: 4
---

# Unit Testing Framework for PigletPrep

https://tuprd-my.sharepoint.com/:x:/g/personal/tuo91182_temple_edu/EQdbX-nRgcBBmlmtXoxjXWMBndkq-NNG0madjt8IM1XVCQ?rtime=oAHdBwRa3Ug

## 1. Purpose
The Test Procedures describe the test approach and the tests to be performed to verify the requirements specified in the Requirements Document. This document provides a structured framework for unit testing, integration testing, and acceptance testing for the PigletPrep project.

## 2. Requirements
This document outlines the procedures for the following tests:

### Unit Tests
Unit testing ensures that individual components or functions work as expected in isolation. The following steps are required:

#### Library Explanation
- The selected unit testing library is **Jest**.
- Jest is chosen due to its simplicity, built-in mocking capabilities, and seamless integration with JavaScript/TypeScript projects.

#### Execution of Tests
- Each method or function must have one or more corresponding test cases.
- A test case includes input parameters and expected results.

#### Link to Test Coverage Report
- Most unit testing software provides the ability to export coverage reports in HTML.
- To integrate with Docusaurus, the exported HTML report should be placed in the `static` folder.
- For automation, a CI pipeline should be set up to generate and update the coverage report whenever changes are made to the repository.

---

### Integration Tests
Integration testing verifies that multiple components or modules work correctly together. The integration testing process follows these principles:

#### Testing Use Cases
- Each use case, as described in the system’s sequence diagrams, will be tested.
- External input will be simulated using mock objects.
- The expected output must be validated using predefined test data.

#### Automation of Tests
- Integration tests will be fully automated and will not require manual data entry.
- Test scripts will execute test scenarios and verify expected outcomes without human intervention.

---

### Acceptance Test
Acceptance testing confirms that the software meets both functional and non-functional requirements. The acceptance testing strategy includes:

#### Demonstrating Functional and Non-Functional Requirements
- Functional tests will be derived from user stories and use cases.
- Non-functional requirements, such as performance and security, will be manually validated where necessary.

#### Combination of Automated and Manual Testing
- Automated tests will handle functional validation.
- Manual tests will be performed where observation and subjective evaluation are required.

#### Documentation of Results
- Test results should be documented and stored for reference.
- The **Blank Sample Acceptance QA Testing doc.xlsx** should be used for structured test reporting.
