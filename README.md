# Xpensto

Xpensto is a full-stack personal finance and expense tracking application built to help users record spending, organize transactions, and understand their financial activity through a structured dashboard experience.

The project combines a React frontend with a Spring Boot backend and is designed as a complete application, not just a standalone API. Its goal is to provide a cleaner and more useful way to manage day-to-day expenses while leaving room for broader finance features such as analytics, budgets, and goals.

## Overview

Xpensto is built around a simple idea: expense tracking should be fast to use and easy to understand. The application is structured to support the typical flow of a personal finance tool:

- create and manage a user account
- add daily expense entries
- organize spending by category
- review expense history
- use dashboard-oriented views to understand spending patterns

The frontend handles navigation, page structure, and user interaction. The backend manages business logic, persistence, and API delivery.

## Core Features

- user registration and user management
- expense creation, retrieval, update, and deletion
- linking each expense to a specific user
- categorized expense tracking
- REST API support for frontend integration
- persistent data storage with a relational database

## Application Structure

This repository is organized into separate application layers:

- [`Frontend`](./Frontend): React-based client interface
- [`Backend`](./Backend): Spring Boot REST API and persistence layer
- `Old project version`: earlier Java project kept for reference

## Frontend

The frontend is responsible for the user-facing experience of Xpensto. Its structure is centered around major product areas such as:

- dashboard
- expenses
- analytics
- categories
- budgets
- goals
- settings

This side of the application is intended to turn raw financial records into a clearer interface for everyday use.

## Backend

The backend is responsible for:

- exposing REST endpoints for users and expenses
- validating and processing request data
- linking expenses to users
- storing data in MySQL
- organizing logic through controller, service, repository, model, and DTO layers

The current API covers:

- `POST /users/register`
- `GET /users`
- `GET /users/{id}`
- `PUT /users/{id}`
- `DELETE /users/{id}`
- `POST /expenses`
- `GET /expenses`
- `GET /expenses/{id}`
- `PUT /expenses/{id}`
- `DELETE /expenses/{id}`

## Domain Model

### User

A user represents an account in the system and includes:

- `id`
- `name`
- `email`
- `password`
- `role`
- `createdAt`

Each user can own multiple expense records.

### Expense

An expense represents an individual spending entry and includes:

- `id`
- `amount`
- `item`
- `category`
- `date`
- `createdAt`
- associated `user`

Each expense belongs to one user.

## Technology Stack

### Frontend

- React
- React Router
- Vite

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Hibernate
- MySQL
- Lombok

## Architecture

Xpensto follows a layered full-stack architecture:

- frontend pages and components for presentation
- REST controllers for HTTP endpoints
- services for business logic
- repositories for database access
- entity models for persistence
- DTOs for request handling

This structure keeps the codebase easier to extend as the application grows.

## Product Direction

Xpensto is structured to support more than basic CRUD. The project is positioned as a growing finance application with room for features such as:

- richer dashboard summaries
- category-based insights
- budget tracking
- savings goals
- analytics and reporting
- stronger authentication and authorization

## Repository Note

This top-level repository represents the full Xpensto application. The frontend and backend are maintained as separate folders so the UI and API can evolve independently while still forming one complete product.
