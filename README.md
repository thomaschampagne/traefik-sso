<div align="center"><img src="https://raw.githubusercontent.com/thomaschampagne/traefik-sso/master/traefik-sso.svg" style="border: 0px" alt=""/></div> <!--https://vectr.com/thomaschampagne/h5j5xaixL1-->

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

## What'is Traefik-sso?

It's a docker image which implements a straightforward **Single Sign-On** authentication for containers behind a [Traefik v2](https://hub.docker.com/_/traefik) edge router.

<div align="center">
    <div><img src="https://imgur.com/m2lq5mD.gif" style="border: 0px" alt=""/></div>
    <div><i>Authentication sequence to a Portainer container through Traefik v2 + Traefik-sso</i></div>
</div>


## Local demo

1 - Run the below docker-compose command locally 

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose.local.yml up -d
```
See [docker-compose.yml](./docker-compose.yml), [docker-compose.local.yml](./docker-compose.local.yml) & [.env](./.env) files

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
| TOKEN_MAX_AGE | Set JWT token life time. Must match with regex: https://regex101.com/r/Q9rYJW/2                         |
| LOG_LEVEL     | Log level (DEBUG, INFO, WARN or ERROR). Do not use DEBUG in production.                           |

## Manage users

Users can be currently managed by editing json database file `${PWD}/data/db.json` through the key `users`. A user-friendly UI is planned to perform this. The current workflow is temporary.

### Add or edit users
 
To add new or update existing credentials you might use the following curl command on `/hash` endpoint. This api will hash the account password using bcrypt:

```bash
curl -d '{"username":"eve", "password":"3v3"}' -H "Content-Type: application/json" -X POST https://sso.domain.localhost/hash; echo
```

Result:

```bash
{"username":"eve","password":"$2a$10$f1sHYu64iZ0zUX6vXnqj0uLE691O0bQTV.YuHw1At2PGL8CBWk/P6"}
```

You need to manually add this json output in the **db.json** database file (`users` key).

### Remove users
Just remove selected users entries in json array.

## Configure SSO login page labels and styles

You can change every text and css styles of you sso login page by editing file `${PWD}/data/config.json`. 

This `config.json` file is following the [AppConfig](https://github.com/thomaschampagne/traefik-sso/blob/master/shared/models/app-config.ts) typescript structure

Here's the UML diagram of this structure:

![UML](http://www.plantuml.com/plantuml/svg/bLDDSzCm4BthLsXwRu035s2W9C09c4wTOoyRQMDh8ckDj6eQElxls4vSEKQPJdFIl8_ilcVf9Z1uZhKLOMTS0nvgMPCZLNcgKRAFE65kEwrHfW77jw2rSQLy_tR2B-bnnDzDyGB_H7GAEtu9QbTwYawlo9AN-yem2c4Sez-2GlcrQLRajgQKJq9sFmiRjE7BXvxuEPm_3dZWWyKJNWndqOfafklhv90p8bdIuAG-3TwZLLJZsh35RanWt-KwpeR85Jes2XZr6XzvnbigZLj6Pd8Pjh6Wi2AhqVVxFyaOq3keyLac6mXXJrwFY6oFLlIUHfFhjo1l_g9EnWtekxxim0aBw1_GV--jq_zhP-67HiRm6zA7OxTt61fomJpW83YrloLVN-RdvULriwRoibHu4PN245wI_G1Zexyuj1KfQdSLSg9fBtCwDQHn2z5oeJoY6vXkvF10m7vQ5SK0VKDbmGCRSfzFrxO6Qrzhik1BV8sf5S8HexpwHHjZyOt6i6DgJe_cIaB89VjDZ2ANUB6u99zsbLbbl4tdZ_xyEQZ_eGfDMV4vjZUQgtDeiLY8ThPm-hAPTSPMreUchzCqVEyoidlt76geAYCPicVmRgUByXjqEjRs7m00)

Note: To configure properly your styles css properties (default, small & large screens) in `config.json` file, you can refer to the typescript interface [CSSStyleDeclaration](https://github.com/microsoft/TypeScript/blob/v3.9.7/lib/lib.dom.d.ts#L2757).

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
