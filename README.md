## Social Networking site BackEnd

The social networking app is designed to provide a means to connet with friends, posting pictures and comments 

## Requirements

* Node 10
* Git
* MongoDB

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/Honrao-Akshata/socialNetworkingSiteBackEnd
cd socialNetworkingSiteBackEnd
```

```bash
npm install
```

## Steps for read and write access (recommended)
```
Step 1:MongoDB setup
```
- Signup with MongoDB Atlas to use mongodb 
- Create Cluster
- Create database with username and password
- Get Connection string for the database required in step 3

```
Step 2: Create .env file in root directory

```

Step 3: Open `.env` and inject your credentials so it looks like this

```
MONGO_URI=<MongoDbConnectionString>
PORT=8080
JWT_TOKEN=<RANDOM_JWT_STRING>
CLIENT_URL=http://localhost:3000
```

Step 3: To start the express server, run the following
```bash
npm run dev```

```
Step 5: To start the express server, run the following

```bash
npm run dev
```
Open (http://localhost:8080) and take a look around.

Step 6: Backend application is runnig go to frontend github repository for further instructions <br>
[FrontEndRepository](https://github.com/Honrao-Akshata/socialNetworkingSiteFrontEnd)






