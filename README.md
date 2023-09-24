# MARVEL - Backend API

Marvel app is a simplified version of a Marvel like website. This API provides the routes used to connect to the frontend part of the app (https://github.com/btboubacar/marvel-frontend).

## Installation

get the repository

```bash
$ git clone https://github.com/btboubacar/marvel-backend
```

enter the directory

```bash
$ cd marvel-backend
```

install the dependencies

```bash
$ npm i
```

## Routes :

### 1. User

#### - **/user/signup**

##### Method : POST

creates a new user

| Body     | Required |     Description      |
| :------- | :------: | :------------------: |
| username |   Yes    | username of the user |
| email    |   Yes    |  email of the user   |
| password |   Yes    | password of the user |

#### - **/user/login**

##### Method : POST

login the user
| Body | Required | Description|
| :---- | :----: | :----: |
| email | Yes | email of the user |
| password | Yes | password of the user |

#### 2. Offer

#### - **/characters**

##### Method : GET

retrieves all the characters with the possibility to filter results by name including pagination.

| Query | Required | Description                            |
| :---- | :------: | :------------------------------------- |
| name  |    No    | character name                         |
| page  |    No    | page number for website pagination     |
| limit |    No    | sets the number of characters per page |

#### - **/character-comics/:characterId**

##### Method : GET

retrieves comics related to a character

| Params      | Required | Description  |
| :---------- | :------: | :----------- |
| characterId |    No    | character id |

#### - **/comics**

##### Method : GET

retrieves all the comics with the possibility to filter results by name including pagination.

| Query | Required | Description                            |
| :---- | :------: | :------------------------------------- |
| title |    No    | comic title                            |
| page  |    No    | page number for website pagination     |
| limit |    No    | sets the number of characters per page |

#### - **/comic/:comicId**

##### Method : GET

retrieves details of a specific comic

| Params  | Required | Description |
| :------ | :------: | :---------- |
| comicId |    No    | comic id    |

### 3. Favorite

#### - **/favorites**

##### Method : GET

retrieves all the favorites selected by the user

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |

#### - **/favorites**

##### Method : POST

posts a new favorite

| Body | Required | Description                           |
| :--- | :------: | :------------------------------------ |
| type |   Yes    | type of favorite : character or comic |
| id   |   Yes    | character or comic id                 |

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |

#### - **/favorites**

##### Method : DELETE

deletes a favorite

| Query | Required | Description                           |
| :---- | :------: | :------------------------------------ |
| type  |   Yes    | type of favorite : character or comic |
| id    |   Yes    | character or comic id                 |

| Headers      | Required | Description |
| :----------- | :------: | :---------- |
| Bearer token |   Yes    | user token  |
