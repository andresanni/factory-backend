# Factory Production Management System - Backend

## Description

The Factory Production Management System is a backend application designed to manage and streamline the production processes of a footwear manufacturing factory. This system provides a RESTful API for handling various aspects of production, including inventory management and categorization of supplies. The application is built using modern technologies to ensure efficiency, scalability, and maintainability.

## Technologies Used

- **TypeScript**: A strongly-typed programming language that builds on JavaScript, providing static type definitions.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **TypeORM**: An ORM (Object-Relational Mapper) that allows for seamless interaction between TypeScript/JavaScript applications and MySQL databases.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine that enables server-side scripting.
- **MySQL**: A popular open-source relational database management system.

## Features

- **Entity Management**: Manages entities and their relationships using TypeORM.
- **RESTful API**: Provides endpoints for CRUD operations on supplies and supply categories.
- **Database Synchronization**: Automatically syncs the database schema with the application entities.
- **Logging**: Includes detailed query logging for debugging and monitoring.

## Setup

### Prerequisites

- Node.js and npm installed
- MySQL server running
- TypeScript installed globally (`npm install -g typescript`)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/factory-production-backend.git
    ```

2. Navigate to the project directory:
    ```bash
    cd factory-production-backend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add your database configuration:
    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=yourpassword
    DB_DATABASE=factory
    ```

5. Compile TypeScript to JavaScript:
    ```bash
    tsc
    ```

6. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

- **GET /supplies**: Retrieve a list of all supplies.
- **GET /supplies/:id**: Retrieve a single supply by its ID.
- **POST /supplies**: Create a new supply.
- **PUT /supplies/:id**: Update an existing supply.
- **DELETE /supplies/:id**: Delete a supply by its ID.

- **GET /categories**: Retrieve a list of all supply categories.
- **GET /categories/:id**: Retrieve a single category by its ID.
- **POST /categories**: Create a new supply category.
- **PUT /categories/:id**: Update an existing category.
- **DELETE /categories/:id**: Delete a category by its ID.

## Project Structure

- `src/`: Contains the source code.
  - `entity/`: TypeORM entities.
  - `controller/`: Controllers for handling HTTP requests.
  - `repository/`: Repositories for data access.
  - `data-source.ts`: TypeORM data source configuration.
  - `index.ts`: Entry point for the application.
- `ormconfig.json`: TypeORM configuration file.
- `package.json`: Project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration file.

## Testing

- Implement tests to ensure the functionality and reliability of the API endpoints.
- Use tools like Mocha, Chai, or Jest for unit and integration testing.

## Contribution

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [andres.anni1985@gmail.com](mailto:andres.anni1985l@gmail.com).

---

Thank you for checking out the Factory Production Management System backend!
