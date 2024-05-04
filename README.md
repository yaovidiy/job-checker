# Logic

## Feed
### When we open main page We will see:
- List of the vacansies according to my preferences
- In the list I should see vacancy title, publication date, vacancy score (matching by skills and salary)
- Current vacancy status (applied, no applied, denied)

## Vacancy
### When I open vacancy page I want to see:
- Company name
- Amount of reviews for the company on doe
- When last review was added on doe
- Button to load and display all reviews
- Company description from doe in short format and expand button
- Vacancy title
- Vacancy description in short format and expand button
- Vacancy amount of reviews
- Vacancy amount of applied
- Vacancy my scrore for that vacancy
- Vacancy last message on djinni
- Button "Apply" to the vacancy.

## Score crateria
- Remote job offer -- 0 | 11%
- Office job offer -- 0 | -50%
- Company type "Product" -- 0 | 11% 
- Title includes React -- 0 | 5%
- Title includes Vue -- 0 | 9%
- Title includes Svelte -- 0 | 12%
- Title includes Middle -- 0 | 4%
- Title includes Senior -- 0 | 11%
- Title includes Front-end -- 0 | 11%
- Title includes FullStack -- 0 | 4%
- Title includes Angular -- set to 0%
- Has public salary item in range >=3500 -- 0 | 12%
- Experience >=3 years -- 0 | 9%

# Development road map

## MVP
- Feed and Vacancy will load dynamicly on demand
- Will work only localy

## v1
- Feed and Vacancy will be saved to the db
- Data will be updated on demand by clicking a button

## v1.5
- Data will be updated once a day automaticaly
- Will be deployed to vercel

## v2
- Add posibility to save traks on the vacancy progress, saving feedback after interviews
- Add posibility to answer on djinni without entering the djinni

## v2.5
- Add user config, save djinni session token