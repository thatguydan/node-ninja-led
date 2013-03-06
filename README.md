node-ninja-led
================

A simple application to control your Ninja Block's LED

### Requirements
1. Node.js (http://nodejs.org/)
2. Redis (http://redis.io/)
3. Have registered a Ninja App


## Installation
```
git clone https://github.com/thatguydan/node-ninja-led.git
cd node-ninja-led
npm install
```

## Sample Development Setup
### Step 1 - Ensure Redis is running
```
redis-server &
```
### Step 2 - Create a development Ninja App
This can be done at https://a.ninja.is/hacking. 

**Important**: Your callback URL will be http://localhost:8000/auth/ninjablocks

The Client ID and Secret given will be used in Step 3.

### Step 3 - Configure development environment
```
export NODE_ENV=development
export NINJA_CLIENT_ID=[your client id]
export NINJA_CLIENT_SECRET="[your client secret]"
```

### Step 4 - Run the instance
```
node app.js
```

### Step 5 - Visit the app in your browser
```
http://localhost:8000
```

## Sample Heroku Deploy
### Step 1 - Create a Heroku App
```
heroku apps:create --addons redistogo:nano
```
**Important**: You must note down the app URL you create in this step as it must be used for the callback when creating a Ninja App

### Step 2 - Createa production Ninja App
This can be done at https://a.ninja.is/hacking.

**Important**: Your callback URL will be the _[heroku url]_/auth/ninjablocks. For example, if the result of step 1 was:
```
Creating sheltered-sands-8183... done, stack is cedar
Adding redistogo:nano to sheltered-sands-8183... done
http://sheltered-sands-8183.herokuapp.com/ | git@heroku.com:sheltered-sands-8183.git
```
Your callback url would be http://sheltered-sands-8183.herokuapp.com/auth/ninjablocks

The Client ID and Secret given will be used in Step 3.

### Step 3 - Configure Apps
```
heroku config:set NINJA_CLIENT_ID=12345
heroku config:set NINJA_CLIENT_SECRET="Your Ninja Secret"
```

### Step 4 - Push Code to Heroku
```
git push heroku master
```



## License
MIT
