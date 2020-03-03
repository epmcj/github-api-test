# My Web Basic Test

A simple web application that displays basic information about GitHub users. 
Its mains objectives are:
- Exercise the concepts of JavaScript language (using Node.js);
- Use Express framework to practice REST API;
- Access a third-party API, in case, GitHub's;
- Create Docker images;
- Create Docker containers and upload them using Docker Compose.

## Building application with Docker Compose
To build the application, run the command:

`docker-compose build`

It will create a Docker image called `epmcj/github-api-test` that can be used to create a container and then run the application.

## Starting application with Docker Compose
To start the application, run the command:

`docker-compose up`

It will run the application and make it available at port **3000**.

## Trying the application
To check if the application is running, access http://localhost:3000.
You should see the introduction message:
> Welcome to my GitHub API test. Use /user/\<login> to search.

Next, try searching for some GitHub user using the message tip. For example, use http://localhost:3000/user/epmcj to search for the user *epmcj*.


## Next steps
- Create automated tests.
- Use a CI tool.
- Use a database.


