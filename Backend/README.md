# Xpensto

Xpensto is a full-stack personal finance and expense management application built to help users track spending, organize transactions, and maintain a clearer view of their financial activity through a modern web interface backed by a structured REST API.

This project is designed as a complete application experience rather than a standalone API. The product combines a frontend dashboard-oriented interface with a Spring Boot backend that manages users, expenses, and application data persistence.

## What Xpensto Is

Xpensto is intended to function as a personal expense tracking system where a user can:

- register and manage their account
- record daily expenses
- group spending by category
- review expense history
- work toward better financial visibility through dashboard-style views

The overall application is structured to support both day-to-day expense entry and broader money management workflows such as budgets, goals, and analytics.

## Application Overview

Xpensto follows a full-stack architecture with two main parts:

- a frontend client responsible for navigation, views, and user interaction
- a backend service responsible for business logic, persistence, and API delivery

The frontend is organized around application sections such as:

- dashboard
- expenses
- analytics
- categories
- budgets
- goals
- settings

The backend provides the data layer and core operations that support these product areas.

## Core Features

The application is centered around the following capabilities:

- user registration and user management
- expense creation, update, retrieval, and deletion
- linking each expense to a specific user
- categorized expense records
- structured backend APIs for frontend integration
- database-backed persistence for financial records

## Domain Model

### User

A user represents an account within the application. Each user contains:

- `id`
- `name`
- `email`
- `password`
- `role`
- `createdAt`

A user can own multiple expenses.

### Expense

An expense represents an individual spending record. Each expense contains:

- `id`
- `amount`
- `item`
- `category`
- `date`
- `createdAt`
- associated `user`

Each expense belongs to one user.

## Backend Responsibilities

The backend is built with Spring Boot and follows a layered structure:

- `controller`: defines REST endpoints
- `service`: contains business rules and data handling
- `repository`: manages database access through JPA
- `model`: defines persistent entities
- `dto`: transfers request payloads between API and service logic
- `config`: contains security and application-level configuration

The backend currently exposes REST endpoints for:

- creating users
- viewing users
- updating users
- deleting users
- creating expenses
- viewing expenses
- updating expenses
- deleting expenses

## Frontend Role

The frontend is the user-facing side of Xpensto. It is designed to present expense information in a cleaner, more accessible way than raw API responses by providing:

- page-based navigation
- dashboard-oriented presentation
- expense-focused views
- feature sections for budgets, goals, analytics, and settings

Together, the frontend and backend form the complete application experience.

## Persistence and Data Handling

Xpensto uses:

- MySQL for relational data storage
- Spring Data JPA for repository abstraction
- Hibernate for ORM behavior

The application models a one-to-many relationship between users and expenses:

- one user can have many expenses
- one expense belongs to one user

## Security

Spring Security is included as part of the application foundation. The current configuration keeps endpoint access open for the present development phase while leaving room for stronger authentication and authorization flows as the application evolves.

## Product Direction

Xpensto is structured as a finance application that can grow beyond basic CRUD into a more complete money management platform. Its architecture supports the addition of features such as:

- authentication and login
- role-based access control
- category insights
- budget tracking
- savings goals
- analytics and summaries
- richer frontend-backend integration

## Repository Note

This repository contains the backend service for Xpensto. The application itself is full-stack, with a separate frontend client forming the complete product experience.
