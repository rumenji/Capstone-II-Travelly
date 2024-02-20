# Project Ideas

### 1. Flight Tracking app
App that tracks flight based on flight number, or airline. It can be real time or past flight. Might also add info about airports, or search by airplane registration number.
What is interesting about apps like this is that the data is dynamic and changes all the time. The app might also include setInterval for updating the flight status page.
External APIs: https://aviationstack.com/documentation

### 2. Password manager
An app that lets users store passwords for different accounts.
Each password entry will have a name, username, password, URL, notes, and last changed fields. The password field will be hidden and only shown when a button is clicked for a specified time - useful use of state and effect in React.
If there are users in the app, shared and personal passwords could be created.
Maybe a password check against a list that can be added by the admin, so user passwords follow a specific requirement.
The passwords will be encrypted - probably bcrypt.

### 3. US National Parks Info Site
The National Park Service has an API with info about US National Parks:
https://www.nps.gov/subjects/developer/get-started.htm
The app can display a list of the parks, with details when the park page is visited.
Maybe a rating system with reviews, user notes.
If login is implemented, maybe the users can build itineraries.

## Preferred
I would prefer the second option. Looks like a nice addition to my first capstone.
