# Labour Connect 

## Aim

To design, develop and deploy a web application using ExpressJS to demonstrate server-side validation and request handling.

## About the Project

Labour Connect is a web application that connects employers with skilled workers and customers with local service providers. It provides two main modules: Employment Connect and On-Demand Service Connect.

The application allows users to find workers, apply for jobs and book services. The backend handles user requests, validates submitted information and returns suitable responses.

## Features

- Worker registration and job applications
- Search and filter workers by skill and location
- Service booking for local customers
- Server-side validation of user input
- Handling GET and POST requests using ExpressJS
- Appropriate success and error messages

## Server-Side Validation

The application checks user information on the server before processing it. It validates required fields, mobile numbers, experience, payment and booking dates. If the submitted data is invalid, the server returns an error message. Valid data is processed successfully.

## Testing

The application can be tested using the following cases:

1. Submit valid information and check the success response.
2. Leave required fields empty and check the error response.
3. Enter an invalid mobile number and verify validation.
4. Test GET and POST requests to check API functionality.

## Deployment

**Live Application:** https://labour-connect1.netlify.app/

## Conclusion

Labour Connect demonstrates the use of ExpressJS for web application development. It helps in understanding server-side validation, API routing, HTTP request handling and communication between the frontend and backend.
