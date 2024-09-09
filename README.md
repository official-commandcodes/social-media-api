## **Social Media API**

This is the API documentation for a Social Media platform that allows users to interact by creating accounts,
posting content, liking and commenting on posts, and following other users. The API provides endpoints
to handle the core social media functionalities such as user registration, authentication, managing posts,
handling likes and comments, and managing user connections (follow/unfollow).

## **Installation**

To install the Project, follow these steps:

- Clone the repository: **`git clone https://github.com/official-commandcodes/social-media-api.git .`**
- Install dependencies: **`npm install`**
- Build the project: **`npm run build`**
- Start the project: **`npm start`**

**NOTE: [NODEMON](https://nodemon.io/) is used in the project**

### Features:

        - **User Authentication**: Register, login, and manage user profiles.
        - **Posts Management**: Create, update, delete, and view posts.
        - **Interactions**: Like, comment, and share posts.
        - **Followers**: Follow and unfollow other users.
        - **Feeds**: Get posts from followed users or a general timeline.

        ### Authentication:
        This API uses **JWT (JSON Web Tokens)** for authentication. To access protected routes,
        the client must include the token in the `Authorization` header as a `Bearer` token.

        ### HTTP Response Codes:
        - `200 OK`: Successful request
        - `201 Created`: Successfully created resource
        - `400 Bad Request`: Invalid data was provided
        - `401 Unauthorized`: Authentication required
        - `403 Forbidden`: Not enough permissions to perform the action
        - `404 Not Found`: Requested resource does not exist

        For more detailed examples of API responses and request formats, explore each endpoint below.

## Data Validation

Making use of [Joi](https://joi.dev/) for data sanitation

##### Register with Joi

```js
function validationRegisterUser(data) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(255).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).required(),
  });

  return schema.validate(data);
}
```
