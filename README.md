# Team Simulation - Server

## Setting up

1. Copy `.env.example` and name it `.env`
2. Create a postgres database and add its URL into the `DATABASE_URL` environment variable, keeping `?schema=prisma` on the end
3. If using a cloud database provider:
    - Create another database and run `create schema shadow` on it
    - Add its URL into the `SHADOW_DATABASE_URL` env var, keeping `?schema=shadow` on the end
4. `npm ci` to install dependencies
5. `npx prisma migrate reset` to apply migrations to your db
6. `npm run dev` to run the app

## Sample Requests

If you use [Insomnia](https://insomnia.rest/), you can import [this request collection .json file](./assets/insomnia_request_collection.json) in the `./assets/` folder to hit the ground running with all of the requests ready to test.

## API Spec

<details>
<summary><strong>POST /user</strong></summary>
<strong>Example body</strong>
<pre>
{
  "first_name": "Nathan",
  "last_name": "King",
  "email": "ngk5@gmail.com",
  "password": "mysecurepassword",
  "biography": "Hello world",
  "github_url": "https://github.com/vherus"
}
</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "user": {
      "id": 8,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk5@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
</pre>
</details>

<details>
<summary><strong>POST /login</strong></summary>
<strong>Example body</strong>
<pre>
{
  "email": "ngk5@gmail.com",
  "password": "mysecurepassword"
}
</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0OTQxMzk0OSwiZXhwIjoxNjQ5NTAwMzQ5fQ.b37lSRtpFWJ9kqUYAc6PUIP28JXjAYtBN_GpU5TcEuc",
    "user": {
      "id": 5,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk2@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
</pre>
</details>

<details>
<summary><strong>POST /post</strong> (hardcoded responses)</summary>
<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example body</strong>
<pre>
{
  "content": "Hello world!"
}
</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "post": {
      "id": 1,
      "content": "Hello world!"
    }
  }
}
</pre>
</details>

<details>
<summary><strong>POST /cohort</strong></summary>
<em>Only auth tokens for users with the TEACHER role can use this route</em>

<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
No body required

<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "cohort": {
      "id": 3
    }
  }
}
</pre>
</details>

<details>
<summary><strong>POST /log</strong> (hardcoded responses)</summary>
<em>Only auth tokens for users with the TEACHER role can use this route</em>

<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example body</strong>
<pre>
{
  "date": "2022-05-05",
  "cohort_id": 3,
  "lines": [
    {
      "content": "Caught up with James"
    },
    {
      "content": "Punished Joel"
    }
  ]
}
</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "log": {
      "id": 1,
      "cohort_id": 3,
      "date": "2022-05-05",
      "author": {
        "id": 5,
        "first_name": "Nathan",
        "last_name": "King"
      },
      "lines": [
        {
          "id": 1,
          "content": "Caught up with James"
        },
        {
          "id": 2,
          "content": "Punished Joel"
        }
      ]
    }
  }
}
</pre>
</details>

<details>
<summary><strong>GET /posts</strong> (hardcoded responses)</summary>
<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": 1,
        "content": "Hello world!",
        "author": {
          "id": 5,
          "cohortId": null,
          "firstName": "Nathan",
          "lastName": "King",
          "email": "ngk2@gmail.com",
          "bio": "Hello world",
          "githubUrl": "https://github.com/vherus",
          "role": "STUDENT"
        }
      },
      {
        "id": 2,
        "content": "Hello from the void!",
        "author": {
          "id": 5,
          "cohortId": null,
          "firstName": "Nathan",
          "lastName": "King",
          "email": "ngk2@gmail.com",
          "bio": "Hello world",
          "githubUrl": "https://github.com/vherus",
          "role": "STUDENT"
        }
      }
    ]
  }
}
</pre>
</details>

<details>
<summary><strong>GET /user/:id</strong></summary>
<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk6@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
</pre>
</details>

<details>
<summary><strong>GET /users?first_name=Name</strong></summary>
The <em>first_name</em> query parameter is optional and case sensitive

<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "cohort_id": null,
        "role": "STUDENT",
        "first_name": "Nathan",
        "last_name": "King",
        "email": "nk3@gmail.com",
        "biography": "Hello world",
        "github_url": "https://github.com/vherus"
      },
      {
        "id": 3,
        "cohort_id": null,
        "role": "STUDENT",
        "first_name": "Nathan",
        "last_name": "Queen",
        "email": "nk2@gmail.com",
        "biography": "Hello world",
        "github_url": "https://github.com/vherus"
      }
    ]
  }
}
</pre>
</details>

<details>
<summary><strong>PATCH /user/:id</strong> (hardcoded responses)</summary>
<em>Only auth tokens for users with the TEACHER role can use this route</em>

<strong>Headers</strong>
<pre>Authorization: Bearer &lt;token&gt;</pre>
<strong>Example body</strong>
<pre>
{
  "cohort_id": 3
}
</pre>
<strong>Example response</strong>
<pre>
{
  "status": "success",
  "data": {
    "user": {
      "cohort_id": 3
    }
  }
}
</pre>
</details>