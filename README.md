# Regear App Backend

## Description

Backend service for the Regear Application, built with NestJS. managing Guild Members and Item Prices.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Members

*   **GET /member**: Get all members.
*   **GET /member/:username**: Get a specific member by username.
*   **POST /member**: Create a new member.
    *   Body: `{ "username": "string", "payout": number, "lastPayoutDue": "Date", "dateJoined": "Date" }`
*   **POST /member/upload**: Upload a CSV file of members.
    *   Key: `file`
    *   CSV Headers: `username`, `payout`, `lastPayoutDue`
*   **PATCH /member/:username**: Update a member.
*   **DELETE /member/:username**: Delete a member.

### Prices

*   **GET /prices**: Get all prices.
*   **GET /prices/:id**: Get a specific price by ID.
*   **POST /prices**: Create a new price entry.
*   **POST /prices/upload**: Upload a CSV file of prices.
    *   Key: `file`
    *   CSV Headers: `Timing`, `ItemName`, `T7`, `T8`, `BW_4_3`, `BW_5_2`, `BW_5_3`, `BW_6_1`, `BW_6_2`, `BW_last_Checked`, `FS_4_3`, `FS_5_2`, `FS_5_3`, `FS_6_1`, `FS_6_2`, `FS_last_Checked`, `alternativeTier`
*   **PATCH /prices/:id**: Update a price entry.
*   **DELETE /prices/:id**: Delete a price entry.

## Database

The project uses SQLite (`regears.db`). Ensure the database file is writable.



# Regear App Frontend

## Description

Frontend application for the Regear App, built with Next.js and Tailwind CSS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Dashboard
Overview of the application.

### Members Management (/members)
*   List all guild members.
*   Upload members via CSV.
*   Add new members manually.

### Prices Management (/prices)
*   List all item prices.
*   Upload prices via CSV.
*   Add new price entries manually.

## Technologies
*   Next.js 15
*   Tailwind CSS
*   TypeScript
