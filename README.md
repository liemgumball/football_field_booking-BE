# Football Field Backend Service

## Target

- Enable football field owners and managers to efficiently manage their facilities, including adding, editing, and removing football field listings.
- Provide a seamless integration with popular booking websites to attract more customers and increase field utilization.
- Offer a user-friendly interface that simplifies the scheduling, pricing, and special offers setup for each football field.
- Generate detailed reports and analytics to help owners make data-driven decisions and optimize field operations.
- Ensure mobile responsiveness for convenient on-the-go management.
- Collaborate with field owners or administrators to gather feedback and continuously improve the platform based on user preferences and suggestions.
- Streamline the management of customer bookings and facilitate direct communication with customers through the platform.
- Design

## Deployment

- [DN Football](https://football-field-booking-be.onrender.com/api/pings)

## Information

- Editor: Visual Studio Code
- Supported Node version: 18 to latest

## Team size

- Dev: Liem Nguyen
- Dev: Le Hoang
- Develop Environment
- Visual Studio Code
- GitHub

## Technical used in this project

- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for authentication
- REST API design principles
- Cron for tasks scheduling
- Docker

## Folder structure

```bash
.
├── src/
│   ├── constants/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── tasks/
│   ├── types/
│   ├── utils/
│   └── index.ts
│   └── pre-start.ts
│   └── server.ts
└── README.md
```

## Getting started

- Step 01: Clone repository with HTTPS

```bash
git clone https://github.com/liemgumball/football_field_booking-BE.git
```

- Step 02: Move to the folder that just cloned in your computer

```bash
cd football_field_booking-BE
```

- Step 03: Install packages

```bash
yarn
```

- Step 04: Build

```bash
yarn build
```

- Step 05: Run (_needed some environment variables to run_)

```bash
yarn start
```
