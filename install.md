# End of study project - Na Mo Naky
 * Louis Singer
 * Romain Beaussart

## Prerequisite
In order to run this app you must install the following packages:
* [**DOCKER**](https://www.docker.com/)
* [**VUE CLI**](https://cli.vuejs.org/guide/installation.html)
* [**PRISMA CLI**](https://www.prisma.io/docs/get-started/01-setting-up-prisma-new-database-JAVASCRIPT-a002/#install-the-prisma-cli)
* [**GRAPHIKMAGICK**](https://github.com/aheckmann/gm)

### 1. Clone this repository
```sh
$ git clone <repo>
```

### 2. Install dependencies
Run this command in both `/backend` and `/vue` directories
```sh
$ npm install
```

### 3. Create and configure environement files
Create a `.env` file in `/backend` :
```
PRISMA_ENDPOINT=
PRISMA_SERVICE=
PRISMA_STAGE=
JWT_SECRET=
FRONT_URL=
```

Create another `.env` file in `/vue` :
```
VUE_APP_GRAPHQL_HTTP=
VUE_APP_GRAPHQL_WS=
VUE_APP_BACKEND=
```

**These settings are personnal and private. You'll have to fill them with your datas**

## Run the application

### 1. Start linked services with Docker
```sh
$ cd backend/prisma
$ docker-compose up -d
```

### 2. Start your server
```sh
$ cd backend
$ npm run start
```

### 3. Open Vue User Interface
```sh
$ vue ui
```
Once user interface opened, you have to click on serve (or build for production) to run the app

### 4. Modify schema
    cd backend;
    prisma generate (use datamodel.prisma)
    prisma deploy

### 5. seed db via prisma
    cd backend;
    prisma reset
    prisma seed (use seed.graphql)


#### 6. Prisma update

    $ sudo npm install -g prisma

In the *backend/prisma* folder

    $ docker-compose up -d

In the *backend* folder

    $ prisma reset -f
    $ prisma generate
    $ prisma deploy -force
