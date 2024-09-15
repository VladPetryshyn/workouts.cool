# Getting started
Start you're mongodb server locally, or use hosted instance.

Clone this app to you're local pc with git
```
git clone https://github.com/VladPetryshyn/workouts.cool.git && cd workouts.cool
```
add secrets to the .env
```.env
MONGODB_URI=mongodb://localhost:27017/workouts
JWT_SECRET=your_secret
```
build the app
```
npm run build
```
and finally start it.
```
npm run start
```
