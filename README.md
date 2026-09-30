# CSV → JSON API

A small Node.js / Express service that parses CSV files with a **hand-written parser** (no CSV libraries), converts rows into nested JSON (dot-notation headers such as `name.firstName` become objects), loads them into **MySQL** and prints an age-distribution report.

## Features

- **Custom CSV parser** (`utils/csvToJsonConverter`): turns dotted headers into nested objects
- **Schema mapping:** `name.firstName` + `name.lastName` → `name`, `age` → integer, `address.*` → JSON column, and every other field → `additional_info` (JSON)
- **MySQL persistence** through a `mysql2/promise` connection pool with parameterised queries
- **Age-group report** (<20, 20–40, 40–60, >60) computed in SQL after each upload
- Config via `.env`

## Setup

```bash
git clone https://github.com/Commanderadi/csv-to-json-api.git
cd csv-to-json-api
npm install
cp .env.example .env   # set DB credentials and CSV_FILE_PATH
```

Create the table (example schema matching the insert query):

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  address JSON,
  additional_info JSON
);
```

## Run

```bash
node server.js
# then open http://localhost:3000/upload
```

The console prints the age-group % distribution once the upload finishes.

## Project structure

```
server.js                     Express app, GET /upload
db.js                         MySQL connection pool
utils/csvToJsonConverter.js   hand-written CSV → nested JSON parser
services/csvUploadService.js  DB inserts + age-group stats
data/                         sample CSV
```

## Design notes

- MySQL was chosen over PostgreSQL for a quicker local setup.
- All parsing is handwritten; no external CSV libraries are used.
- The parser splits on commas and doesn't handle quoted fields that contain commas; that would be the first thing to add.
- It handles 50K+ records in memory. For larger files, the next step would be streaming rows and batching inserts.

## Stack

Node.js · Express · MySQL (mysql2) · dotenv
