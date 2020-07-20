<div align="center"><img src="./traefik-sso.svg" style="border: 0px" alt=""/></div> <!--https://vectr.com/thomaschampagne/h5j5xaixL1-->

![Version](https://img.shields.io/github/package-json/v/thomaschampagne/traefik-sso?style=flat-square)
![License: MIT](https://img.shields.io/github/license/thomaschampagne/traefik-sso?style=flat-square)

![Docker Pulls](https://img.shields.io/docker/pulls/thomaschampagne/traefik-sso.svg?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/thomaschampagne/traefik-sso/main/dev?label=traefik-sso:dev&style=flat-square)


![angular](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/@angular/core?filename=frontend%2Fpackage.json&label=angular&style=flat-square) 
![ng-boostrap](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/@ng-bootstrap/ng-bootstrap?filename=frontend%2Fpackage.json&label=ng-boostrap&style=flat-square)
![express](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/express?filename=backend%2Fpackage.json&label=express&style=flat-square)
![bcryptjs](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/bcryptjs?filename=backend%2Fpackage.json&label=bcryptjs&style=flat-square)
![jsonwebtoken](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/jsonwebtoken?filename=backend%2Fpackage.json&label=jsonwebtoken&style=flat-square)
![typescript](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/dev/typescript?filename=backend%2Fpackage.json&label=typescript&style=flat-square)
![rollup](https://img.shields.io/github/package-json/dependency-version/thomaschampagne/traefik-sso/dev/rollup?filename=backend%2Fpackage.json&label=rollup&style=flat-square)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

------------

# Traefik SSO

Traefik SSO implements a straightforward Single Sign-On authentication for your containers behind a Traefik v2 edge router

## Local demo

1 - Run the below docker-compose command locally 

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose.local.yml up -d
```

2 - When containers are up, open `${PWD}/data/db.json` and add the below temporary `alice` user:

```json
{
    "users": [
        {
            "username": "alice",
            "password": "$2y$10$mNJw6ojRWORz10gDaj602.8auytb58peR/hwdewqFpCershSO7DGm"
        }
    ]
}
```

The password has been hashed using `bcrypt`, value is `4lic3`.

3 - Open http://iamfoo.domain.localhost in a browser (or http://iambar.domain.localhost).

4 - You should be redirected to http://sso.domain.localhost to logon on the domain `domain.localhost`

5 - Logon using username: `alice` and password: `4lic3`.

6 - You should be redirected to http://iamfoo.domain.localhost (or http://iambar.domain.localhost)

7 - Logout from sso using http://sso.domain.localhost/logout. This will clear jwt token cookie on domain `*.domain.localhost`  

*Note: Environment variables used in demo are defined in `.env` file.*

## Environment variables

| Name          | Description                                                                                       |
|---------------|---------------------------------------------------------------------------------------------------|
| DOMAIN        | Domain to authenticate through the sso                                                            |
| SECRET        | Secret used for JWT token signature.                                                              |
| TOKEN_MAX_AGE | Set JWT token life time. Must with regex: https://regex101.com/r/Q9rYJW/2                         |
| LOG_LEVEL     | Log level (DEBUG, INFO, WARN or ERROR). Do not use DEBUG in production.                           |

## Manage users

Users can be currently managed by editing json database file `${PWD}/data/db.json` through the key `users`. A user-friendly UI is planned to perform this.

### Add or edit users
 
To add new or update existing credentials you might use the following endpoint which will hash passwords using bcrypt for you:

http://sso.domain.localhost/hash?credentials=username:password

*Note: the **db.json** database file will not be edited on endpoint hit. You have to inject changes manually in the **db.json** file.*  

### Remove users
Just remove selected users entries in json array.

## Configure SSO login page labels and styles

TODO

## Build production image

```bash
docker build -t traefik-sso:yourtag .
```

## Local development

1 - Install npm dependencies
 
```bash
npm install
```

2 - Build local `traefik-sso:dev` image through compose

```bash
npm run docker:dev:build
# or
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml build
```

3 - Run local development

```bash
npm run docker:dev:up
# or
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up
```

4 - Now follow steps from [local demo](#local-demo) section, you have same environment but in development 😊.
