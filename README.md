# Frontend Mentor - Kanban task management web app solution

- A full-stack Next.js application for efficient task management
![Kanban logo](public/assets/logo-dark.svg)

This is a solution to the [Kanban task management web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [Features](#-features)
  - [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
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

## ✨ Features

- **📱 Responsive Design** - Optimized for all device sizes
- **🎨 Theme Switching** - Toggle between light and dark modes
- **🔄 CRUD Operations** - Create, read, update, and delete boards and tasks
- **✅ Subtask Management** - Mark subtasks as complete
- **📊 Column Management** - Move tasks between columns
- **👁️ Sidebar Toggle** - Hide/show the board sidebar
- **🖱️ Drag and Drop** - Reorder tasks and move between columns
- **🔒 Data Persistence** - All changes persist in the database
- **🚀 GSAP Animations** - Smooth animations for enhanced user experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (or Neon account)

### Installation

- Clone the repository

```bash
   git clone https://github.com/ChamuMutezva/kanban-dashboard.git
   cd kanban-dashboard
```

- Install dependencies `pnpm install`

- Set up environment variables. Create a `.env` file in the root directory with the following:  `DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"`
- Generate Prisma client `npx prisma generate`
- Run development server: `pnpm dev`
- Open [http://localhost:3000](http://localhost:3000) in your browser

### The challenge

## 5. Add Architecture and Technology Details

```markdown
## 🏗️ Architecture
```

### Tech Stack

- **Frontend**:
  - Next.js 15 (App Router)
  - React 19
  - Tailwind CSS
  - Shadcn UI Components
  - GSAP for animations
  - dnd kit for drag and drop

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - Neon PostgreSQL (Serverless)

- **Deployment**:
  - Vercel

### Database Schema

```prisma
model Board {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  columns   Column[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Column {
  id        String   @id @default(uuid())
  name      String
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks     Task[]
  position  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  columnId    String
  column      Column    @relation(fields: [columnId], references: [id], onDelete: Cascade)
  subtasks    Subtask[]
  position    Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Subtask {
  id          String   @id @default(uuid())
  title       String
  isCompleted Boolean  @default(false)
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Connect Neon from Prisma

- Retrieve your Neon connection string. You can find it by clicking the Connect button on your Project Dashboard. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you. For the complete information see the following docs [Connecting to neon with Prisma](https://neon.tech/docs/guides/prisma#connect-to-neon-from-prisma)

## Screenshot

### ![Dashboard](public/assets/Kanban-dashboard-App.png)

### Links  
  
- Live Site URL: [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://kanban-dashboard-cyan.vercel.app/)
- Frontend Mentor Project site:  [![Frontend Mentor](https://img.shields.io/badge/Frontend%20Mentor-Challenge-blue)](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB)
- Gitingest summary: [Project summary as text](https://gitingest.com/ChamuMutezva/kanban-dashboard)

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

- the `AppSidebar` is a client component which is imported in the layout component. It consist of the main navigation elements and it is the primary navigation component. The boards are to be fetched from the neon database using prisma.
- The connection string includes the user name, password, hostname, and database name.

 ```ts
 datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
```

- Add a DATABASE_URL variable to your .env file and set it to the Neon connection string that you wrote above. It is also recommended adding ?sslmode=require to the end of the connection string to ensure a secure connection.

### Prisma client generation issues and steps to fix

C:\Users\chamu\Documents\GitHub\kanban-dashboard\node_modules\.prisma\client\runtime\library.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: TypeError [ERR_INVALID_ARG_TYPE]: The "payload" argument must be of type object. Received null
 ⨯ [Error: Connection terminated unexpectedly] {
  clientVersion: '6.7.0',
  digest: '1247916745'
 }

#### Steps to fix the above

1. Remove-Item -Path ".next" -Recurse -Force
→ Deletes Next.js build cache to eliminate any corrupted build files.

2. Remove-Item -Path "node_modules/.prisma" -Recurse -Force
→ Clears Prisma's generated client files to force a fresh regeneration.

3. Remove-Item -Path "node_modules/@prisma" -Recurse -Force
→ Removes Prisma's npm package artifacts to prevent version conflicts.

4. pnpm store prune
→ Cleans PNPM's global cache of unused packages to ensure clean reinstalls.

5. pnpm install
→ Reinstalls all dependencies from scratch using PNPM's strict linking.

6. npx prisma generate
→ Regenerates the Prisma client with fresh database schema definitions.

### Continued development

```markdown
#### 🗺️ Future Roadmap

- [ ] User authentication and multi-user support
- [ ] Real-time collaboration with WebSockets
- [ ] Task comments and activity log
- [ ] File attachments for tasks
- [ ] Advanced filtering and search
- [ ] Email notifications-
- [ ] drag and drop feature
```

### Useful resources

- [Connecting to neon with Prisma](https://neon.tech/docs/guides/)
- [gsap animation](https://gsap.com/)

## Author

<div align="center">
  <img src="https://github.com/ChamuMutezva.png" alt="Chamunorwa Mutezva" width="100" style="border-radius: 50%"/>
  
  <h3>Chamunorwa Mutezva</h3>
  
  <p>Full Stack Developer passionate about creating accessible and performant web applications</p>
  
  <a href="https://github.com/ChamuMutezva">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://www.frontendmentor.io/profile/ChamuMutezva">
    <img src="https://img.shields.io/badge/Frontend%20Mentor-3F54A3?style=for-the-badge&logo=frontendmentor&logoColor=white" alt="Frontend Mentor"/>
  </a>
  <a href="https://www.twitter.com/chamumutezva">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"/>
  </a>
</div>

## Acknowledgments
