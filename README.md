<div align="center">

# Piglet Prep

[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/PLTA/boards/420)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/Capstone-Projects-2025-Spring/project-piggyback-learning-team-1/actions)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-spring.github.io/project-piggyback-learning-team-1/)

</div>

<div align="center">
  
<img src="https://raw.githubusercontent.com/Capstone-Projects-2025-Spring/project-piggyback-learning-team-1/refs/heads/main/documentation/static/img/pig-glasses.gif" alt="Smart Pig GIF"/>
<h3>Hammy the Pig</h3>

</div>

## Project Abstract

This website is a child-friendly video platform designed to offer interactive educational content. Videos are enhanced with embedded Multiple Choice Questions (MCQs) to engage children and assess their understanding as they watch. The system allows users to sign in, track their progress, and review performance analytics.

## Piglet Prep on Web Browser
You can access the deployed site here: https://github.com/Capstone-Projects-2025-Spring/project-piggyback-learning-team-1/releases/tag/1.1.0

## Running Piglet Prep Locally 
1. Create a S3 bucket
2. Download the following video as .mp4 and add to S3 buckets with the following filenames:
    - [giant_pandas](https://www.youtube.com/watch?v=dqT-UlYlg1s&pp=ygUMZ2lhbnQgcGFuZGFz)
    - [our_sun](https://www.youtube.com/watch?v=sePqPIXMsAc&pp=ygUPb3VyIHN1biBjYXJ0b29u)
    - [husky](https://www.youtube.com/watch?v=msAnR82kydo&pp=ygUQaHVza3kgZG9kbyBtaWxlcw%3D%3D)
    - [tigers](https://www.youtube.com/watch?v=FK3dav4bA4s&pp=ygUadGlnZXJzIG5hdGlvbmFsIGdlb2dyYXBoaWM%3D)
    - [australia](https://www.youtube.com/watch?v=9ZyGSgeMnm4&pp=ygUXa2lkcyBndWlkZSB0byBhdXN0cmFpbGE%3D)
4. Acquire API keys for:
  - OpenAI (for ChatGPT)
  - AWS (one for Rekognition and another for S3 access)
  - MongoDB (for storing metrics)
5. Create a .env.local file at project-piggyback-learning-team-1/pigletprep and add the following variables and match it with your API keys you created at the // mark:
```sh
AWS_ACCESS_KEY_ID=//S3 API KEY
AWS_SECRET_ACCESS_KEY=//S3 SECRET API KEY
AWS_REGION=//AWS REGION
AWS_REGION_NAME=//AWS REGION
S3_BUCKET_NAME=//S3 BUCKET NAME
OPENAI_API_KEY=//OPENAI API KEY
MONGODB_URI=//MONGODB API KEY
secretAccessKey=//AWS REKOG. SECRET KEY
accessKeyId=//AWS REKOG. API KEY
NEXT_PUBLIC_METRICS_PAGE_KEY=//CREATE A PIN FOR METRICS
```
6. Run the following commands in your terminal:

```sh
cd pigletprep
npm install
npm run build
npm start
```

NOTE: To ensure video plays on video page, check to see if you have "Use graphics acceleration when available" enabled on browser.
NOTE: Also in ".env.local" file, ensure there is no space between the "=" and your API keys.

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Hxrob">
            <img src="https://avatars.githubusercontent.com/u/145741134?v=4" width="100;" alt="Hxrob"/>
            <br />
            <sub><b>Hirab Abdourazak</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/noel-chacko">
            <img src="https://avatars.githubusercontent.com/u/69741906?v=4" width="100;" alt="noel-chacko"/>
            <br />
            <sub><b>Noel Chacko</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Henry2809">
            <img src="https://avatars.githubusercontent.com/u/104811832?v=4" width="100;" alt="Henry2809"/>
            <br />
            <sub><b>Henry Nguyen</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/adrewtran117">
            <img src="https://avatars.githubusercontent.com/u/89867547?v=4" width="100;" alt="adrewtran117"/>
            <br />
            <sub><b>Andrew Tran</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/sophiechen18">
            <img src="https://avatars.githubusercontent.com/u/143643355?v=4" width="100;" alt="sophiechen18"/>
            <br />
            <sub><b>Sophie Chen</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/ewongzz">
            <img src="https://avatars.githubusercontent.com/u/117427711?v=4" width="100;" alt="ewongzz"/>
            <br />
            <sub><b>Ernest Wong</b></sub>
        </a>
    </td>
</tr>

</table>

[//]: # ( readme: collaborators -end )


