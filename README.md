# Tripma

## Overview
Tripma is a comprehensive travel booking system designed to manage users, flights, reservations, payments, feedback, hotels, and packages seamlessly. This project combines functionality with a user-friendly design to streamline travel planning and booking.

---

## ERD (Entity Relationship Diagram)

An overview of the system's database structure:

![ERD Diagram](./assets/diagram.svg)

### Table Definitions
```plaintext
title Travel Booking System

// Define tables
users [icon: user, color: yellow] {
  id string pk
  email_or_phone string
  password string
}

flights [icon: airplane, color: blue] {
  id string pk
  from string
  to string
  departure timestamp
  arrival timestamp
  available_economy_seats string[]
  available_vip_seats string[]
  price_vip float
  price_economy float
  is_round boolean
  return_trip_id string fk
}

reservations [icon: clipboard, color: green] {
  id string pk
  user_id string fk
  payment_id string fk
  flight_id string fk
  seat string
}

payments [icon: credit-card, color: purple] {
  id string pk
  payment_method string
  price float
  user_id string fk
  date timestamp
}

feedback [icon: message-circle, color: orange] {
  id string pk
  user_id string fk
  content string
  rate int
}

hotels [icon: home, color: red] {
  id string pk
  title string
  price float
  location string
  description string
}

packages [icon: package, color: teal] {
  id string pk
  flight_id string fk
  hotel_id string fk
  title string
  description string
}

// Define relationships
reservations.user_id > users.id
reservations.payment_id > payments.id
reservations.flight_id > flights.id
payments.user_id > users.id
feedback.user_id > users.id
packages.flight_id > flights.id
packages.hotel_id > hotels.id
flights.return_trip_id > flights.id

###

## API Documentation

The API endpoints for the Tripma system are organized as follows:

https://documenter.getpostman.com/view/40388911/2sAYHxmP3S

## Deployment 

https://tripma-amber.vercel.app/