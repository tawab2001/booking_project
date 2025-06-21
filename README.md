
# EasyTicket – Event Booking Platform

EasyTicket is a full-stack web application built as a graduation project at the Information Technology Institute (ITI). The platform allows users to discover, book, and manage tickets for various events, while providing event organizers with a dashboard to manage listings, track performance, and view analytics.

## Features

- Browse and search for events
- Book and manage event tickets
- Role-based system: Admin & User
- Admin dashboard with real-time analytics (revenue, users, ticket sales)
- Commission-based revenue model ($2 profit per ticket)
- Secure authentication and authorization system

## Tech Stack

### Backend
- Django
- Django REST Framework
- Python

### Frontend
- React.js
- JavaScript
- React Bootstrap
- Chart.js
- Axios

### Database
- PostgreSQL (also works with SQLite for testing)

### Tools
- Git & GitHub
- RESTful APIs
- Docker (optional)

## Screenshots
### home page
![home page](screenshots/home1.png)
![home page](screenshots/home2.png)
### admin dashboard
![admin dashboard](screenshots/admin%20panal.png)
### event details page
![event details page](screenshots/detils.png)
## add event
![add event](screenshots/add%20event%20s1.png)
![add event](screenshots/add%20event%20s2.png)
![add event](screenshots/add%20event%20s3.png)
### login page
![login page](screenshots/login%20.png)
### signup page
![signup page](screenshots/regester.png)
![signup company page](screenshots/regester%20organizer.png)
![signup user page](screenshots/regester.png)
### user profile
![user profile](screenshots/profil1.png)
![company profile](screenshots/profile%20company.png)
### organizer dashboard
![organizer dashboard](screenshots/org%20dashboard.png)




## How to Run the Project Locally

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Folder Structure

```
EasyTicket/
│
├── backend/           # Django project
│   ├── api/           # APIs for events, tickets, users
│   └── ...
│
├── frontend/          # React app
│   ├── src/
│   └── ...
│
├── README.md
└── ...
```

## Author

Ahmed Tawab 

## License

This project is for educational purposes.
