# Project Overview

This project encompasses a robust backend API designed to facilitate user management and product operations. Leveraging a Node.js and Typescript runtime environment, the API integrates seamlessly with MongoDB, a NoSQL database, for efficient data storage and retrieval. The use of Docker ensures a consistent and scalable deployment environment.

The API covers essential user-related functionalities, including user registration, login, and profile updates. Additionally, it supports product management, enabling the creation, updating, and deletion of products. Pagination is implemented for retrieving user and product lists.

Developed with security in mind, the API mandates the use of authorization tokens for sensitive operations. Furthermore, HTTPS ensures secure data transmission.

This project is well-documented, providing clear and concise information on each API endpoint, their required parameters, and expected responses. The technology stack ensures a foundation that is both reliable and adaptable for future enhancements. For detailed usage guidelines and examples, refer to the individual sections in the documentation.

## Technology Stack

This project is built using a modern technology stack to ensure efficiency, scalability, and maintainability.

- **Node.js:** The server-side runtime environment, leveraging the event-driven, non-blocking I/O model for high-performance server-side applications.

- **Typescript:** A superset of JavaScript that adds static types, enhancing code quality, readability, and developer productivity.

- **MongoDB:** A NoSQL database, providing a flexible and scalable solution for storing and retrieving data efficiently.

- **Docker:** Used for containerization, Docker simplifies deployment and ensures consistency across various environments, enhancing scalability and ease of deployment.

These technologies work together to create a robust and scalable backend system for the project, providing a solid foundation for future development and expansion.


## Getting Started

Follow these steps to clone the repository, set up the project, and run it locally.

### Prerequisites

Make sure you have the following dependencies installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)
- [Docker](https://www.docker.com/)

### Clone the Repository

```bash
git clone https://github.com/lilstex/store-api.git
```

### Navigate to the Project Directory

```bash
cd store-api
```

### Copy Environment Variables

Copy the contents of the `.env.example` file and create a new file named `.env` in the project root. Update the variables with your specific configuration:

```bash
PORT=your-port
JWT_KEY=your-jwt-key
TOKEN_VALIDATION_DURATION=your-token-duration
MONGODB_URI=your-mongodb-uri-for-rest-api
TEST_DB=your-mongodb-uri-for-test-database
```

### Build Docker Image

Ensure you are in the root folder containing the Dockerfile.

```bash
docker build -t your-image-name .
```

### Run Docker Container

Replace `your-container-port` with the desired local port (e.g., 3000).

```bash
docker run -p your-container-port:3000 -d your-image-name
```

The API should now be running locally. Access it through `http://localhost:your-container-port`.

### Run Tests

To execute tests, run the following command:

```bash
npm test
```

## API Documentation

### 1. Create User

- **Endpoint:** `/api/user/register`
- **Method:** `POST`
- **Description:** Enables user registration. Requires `email`, `password`, and `username` in the request body. Returns user details on success.

### 2. Login

- **Endpoint:** `/api/user/login`
- **Method:** `POST`
- **Description:** Facilitates user login. Requires `email` and `password` in the request body. Returns an authorization token on success.

### 3. Update Username

- **Endpoint:** `/api/update-username`
- **Method:** `PATCH`
- **Description:** Updates the user's username. Requires a valid authorization token and the new `username` in the request body.

### 4. Get User Details

- **Endpoint:** `/api/get-user`
- **Method:** `GET`
- **Description:** Retrieves user details by ID. Requires a valid authorization token and the `userId` in the query parameters.

### 5. Delete User

- **Endpoint:** `/api/delete-user`
- **Method:** `DELETE`
- **Description:** Deletes the user's own account. Requires a valid authorization token.

### 6. Create Product

- **Endpoint:** `/api/product/create-product`
- **Method:** `POST`
- **Description:** Creates a new product. Requires a valid authorization token and product details in the request body.

### 7. Update Product

- **Endpoint:** `/api/product/update-product`
- **Method:** `PUT`
- **Description:** Updates an existing product. Requires a valid authorization token and product details in the request body, including the `productId`.

### 8. Get Product by ID

- **Endpoint:** `/api/product/get-product`
- **Method:** `GET`
- **Description:** Retrieves product details by ID. Requires a valid authorization token and the `productId` in the query parameters.

### 9. Get All Products

- **Endpoint:** `/api/product/get-all-products`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of all products. Requires a valid authorization token and pagination parameters in the query.

### 10. Delete Product

- **Endpoint:** `/api/product/delete-product`
- **Method:** `DELETE`
- **Description:** Deletes a product by ID. Requires a valid authorization token and the `productId` in the request body.

### 11. Delete Multiple Products

- **Endpoint:** `/api/product/delete-multiple-products`
- **Method:** `DELETE`
- **Description:** Deletes multiple products. Requires a valid authorization token and an array of product IDs in the request body.

## Documentation Links

- [Postman Documentation](https://documenter.getpostman.com/view/15847668/2s9YeEcXkN)
- [Swagger Documentation](https://mainstack-api-a35cb424abb6.herokuapp.com/api-docs/)

## Usage Guidelines

1. Include the provided authorization token in the header for secured endpoints.
2. Ensure secure transmission using HTTPS for all interactions.
3. Follow the specified request body format for each endpoint.
4. Handle errors by checking the HTTP status code and the accompanying error details in the response.

## Security Considerations

1. Use strong and unique passwords for user accounts.
2. Protect and securely store authorization tokens.
3. Regularly update and patch the system to address security vulnerabilities.
4. Implement secure transmission using HTTPS for all API interactions.

## License

This project is licensed under the [MIT License](LICENSE.md). Feel free to modify and use the code as needed, and contributions are welcome.