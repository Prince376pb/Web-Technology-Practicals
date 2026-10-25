# Labour Connect – RESTful CRUD API

## About the Project

Labour Connect is a web application developed using Node.js, Express.js and SQLite. It helps manage the details of skilled workers such as plumbers, electricians, carpenters, mechanics and painters.

This project demonstrates CRUD operations, server-side validation and API testing using Postman.

## Features

- Add new worker details.
- View all registered workers.
- View details of a particular worker.
- Update existing worker information.
- Delete worker records.
- Validate user input on the server.
- Store worker information in an SQLite database.
- Display appropriate success and error responses.
- View worker statistics through an API endpoint.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- SQLite
- REST API
- Postman
- HTML, CSS and JavaScript (for the frontend, if included)

## Project Structure

```text
labour-connect/
├── controllers/
├── data/
├── models/
├── public/
├── routes/
├── test/
├── validators/
├── server.js
├── package.json
├── package-lock.json
├── vercel.json
└── .gitignore
```

## API Endpoints

| Method | Endpoint           | Purpose               |
| ------ | ------------------ | --------------------- |
| GET    | `/api/workers`     | Get all workers       |
| GET    | `/api/workers/:id` | Get a worker by ID    |
| POST   | `/api/workers`     | Add a new worker      |
| PUT    | `/api/workers/:id` | Update worker details |
| DELETE | `/api/workers/:id` | Delete a worker       |
| GET    | `/api/stats`       | Get worker statistics |

## Server-Side Validation

The application checks worker details before saving or updating records. It validates fields such as name, email, phone number, skill, experience and location.

If the entered information is invalid, the server returns an appropriate error response.

## Testing

The API can be tested using Postman with both valid and invalid data. The main tests include adding a worker, viewing records, updating details, deleting records and checking invalid inputs.

## Conclusion

This project helped me understand the basics of backend development, database operations and REST API testing. It also demonstrated how worker information can be managed through a simple and organised application.
