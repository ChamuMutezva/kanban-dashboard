# Frontend Mentor - Kanban task management web app solution

This is a solution to the [Kanban task management web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

- project created using NextJs
- data stored using Neon database.
- used Prisma to intergrate the data.
- project deployed on vercel
- tailwind css for styling
- Shadcn component library - for buttons , cards etc

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete boards and tasks
- Receive form validations when trying to create/edit boards and tasks
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar
- Toggle the theme between light/dark modes
- **Bonus**: Allow users to drag and drop tasks to change their status and re-order them in a column
- **Bonus**: Keep track of any changes, even after refreshing the browser (`localStorage` could be used for this if you're not building out a full-stack app)
- **Bonus**: Build this project as a full-stack application

- the `AppSidebar` is a client component which is imported in the layout component. It consist of the main navigation elements and it is the primary navigation component. The boards are to be fetched from the neon database using prisma.
- The connection string includes the user name, password, hostname, and database name.

 ```ts
 datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
```

- Add a DATABASE_URL variable to your .env file and set it to the Neon connection string that you wrote above. It is also recommended adding ?sslmode=require to the end of the connection string to ensure a secure connection.

### Connect Neon from Prisma

- Retrieve your Neon connection string. You can find it by clicking the Connect button on your Project Dashboard. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you. For the complete information see the following docs [Connecting to neon with Prisma](https://neon.tech/docs/guides/prisma#connect-to-neon-from-prisma)

## Screenshot

### ![Dashboard](public/assets/Kanban-dashboard-App.png)

### Links

- Gitingest summary: [Project summary as text](https://gitingest.com/ChamuMutezva/kanban-dashboard)
- Live Site URL: [Kanban dashboard](https://kanban-dashboard-cyan.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library
- [Next.js](https://nextjs.org/) - React framework

### What I learned

### Continued development

### Useful resources

- [Connecting to neon with Prisma](https://neon.tech/docs/guides/)

## Author

- Website - [Chamunorwa Mutezva](https://github.com/ChamuMutezva)
- Frontend Mentor - [@ChamuMutezva](https://www.frontendmentor.io/profile/ChamuMutezva)
- Twitter - [@ChamuMutezva](https://www.twitter.com/chamumutezva)

## Acknowledgments
