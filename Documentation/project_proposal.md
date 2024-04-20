# Project Proposal

This project is about creating a web application that allows users to create trip itineraries, search for places of interest and add them for each day of their trip so they can plan and keep track of daily activites. Users can also input time it would take to visit and 
time of day for the visit.

## Goal

- A web application that allows users to track their trip activities
- The app will provide the option to add places to visit per day of a trip. 
- The app will show relevant POIs that can be added to the itinerary.
- The app will allow the users to add time it would take for each place to visit.
- The app will require login - no permission levels required.

## User Profile

There'll be a single user type:
- Regular users
  - Users can register/edit registration details and passwords, and log in.
  - Regular users can create, update, and log trips.
  - Regular users can add/edit/remove activities/POIs to trip days.
  - Regular users can search for POIs to add for each day.

## Data / API Information

The data about POIs will be privided by the TomTom Places API.
Users can search for destination, then it will be saved to the trip. The location coordinates will be used for geo-bias when querying the API for relevant places to visit.
For each day of a trip, the users can search for POIs and add them to their itinerary.
The local database will store information about the trip's location and places, so it doesn't query the TomTom API for each existing trip. It will also store information about days of the trips - each day will have different activities/POIs added to it, with the time it would take to visit.

## Methodologies

### Tech Stack

- Node.js
- Express.js
- JavaScript
- React
- ReduxToolkit
- CSS
- MatrialUI
- PostreSQL
- Bcrypt
- JSONWebToken
- Axios
- Lodash debounce

### Database Schema

[Entity Relationship Diagram](DatabaseDiagram.jpeg)

- DB design assumptions:

  - A user can create many trips/itineraries.
  - Days are created automatically depending on the date range of the trip.
  - A day can have many activities/POIs.
  - A day can belong to one trip.
  - A POI can belong to may days and trips.

### Security

  - User passwords will be hashed using bcrypt library.
  - User passwords will be validated using the bcrypt library.
  - JSON Web Tokens

- Sensitive information that needs to be protected:

  - User passwords
  - User email addresses

## Features


MUST-HAVE

| Feature | Estimated Time | Actual Time |
| ------- | -------------- | ----------- |
| User registration/login | 30 hours | 34 hrs |
| Edit user info and passwords | 10 hours | 14 hrs |
| Create trips     |  20 hrs          | 23 hrs       |
| Automatically create days for each trip | 12 hrs | 11 hr |
| Add activities/POIs for each trip | 15 hrs | 13.5 hrs |
| Add time it takes to visit for each trip | 2 hrs | 1.75 hrs |
| View/Add/Edit POIs | 23 hr | 21 hr|
| Single user type | 15 hrs | 11.5 hrs |
| Dashboard with list of trips| 10 hours | 14 hrs |


SHOULD-HAVE

| Feature | Estimated Time | Actual Time |
| ------- | -------------- | ----------- |
| Save destination coordinates for geo-bias for POIs querying | 15 hr | 17 hr |


COULD-HAVE

| Feature | Estimated Time | Actual Time |
| ------- | -------------- | ----------- |
| Map of the POI     | 10 hrs          |        |


MORE THAN CRUD FEATURES

| Feature | Estimated Time | Actual Time |
| ------- | -------------- | ----------- |

### Tasks

Reference to the project board and issues:

[Project Board][https://github.com/rumenji/Capstone-II/projects?query=is%3Aopen]
[List of Issues][https://github.com/rumenji/Capstone-II/issues]

**New issue checklist:**

1. Enter Task title & Task Code
2. Enter Task description: enter requirement of the task and what needs to be done to complete the task.
3. Label the issue
4. Add story points label
5. Assign the task


**Story Points reference:**

| Story Points | Description                                                                                                                                                                                                              |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1            | Very simple / trivial task, you can do it in (max) 1 hour                                                                                                                                                                |
| 2            | Simple / decent / not too difficult task, you can do it (max) a day                                                                                                                                                      |
| 3            | Difficult task, you’re not immediately sure of how to solve it, needs some further research, but you know the underlying concept on how to solve it.                                                                     |
| 5            | Difficult complex task, requires extensive research, a lot of features combined into one ticket. This will not be a story / task, this will be something more of an Epic ticket.  **Needs to be broken into smaller tasks.** |

## User Flow Diagram


[User Flow Diagram](TravellyUserFlow.jpg)



## Challenges & Risk Mitigation


| Challenges     | Risk Mitigation Plan / Strategy |
| -------------- | ------------------------------- |
| Securing user passwords       | Hashing the passwords with Bcrypt |
| Securing user sessions       | JSON WebTokens |

## Out of Scope


- Will not have detailed permissions settings and levels of access.
- Will not have reporting.
- Will not have support and KB articles available within the app.
