// import React from 'react';

// const Events = () => {
//     return (
//         <div>
//             <h1>Events Page</h1>
//             <p>Welcome to the Events page. Here you can find all the upcoming events.</p>
//         </div>
//     );
// };

// export default Events;

  const events = [
    {
      id: 1,
      title: "مهرجان الموسيقى",
      date: "25 مايو 2025",
      location: "الرياض",
      seatsAvailable: 120,
      description:
        "استمتع بأروع الليالي الموسيقية مع أفضل الفرق المحلية والعالمية.",
      image: "https://via.placeholder.com/400x250?text=مهرجان+الموسيقى",
    },
    {
      id: 2,
      title: "مباراة كرة قدم",
      date: "10 يونيو 2025",
      location: "جدة",
      seatsAvailable: 50,
      description: "مباراة القمة بين أقوى الفرق مع أجواء حماسية لا تُنسى!",
      image: "https://via.placeholder.com/400x250?text=مباراة+كرة+القدم",
    },
    {
      id: 3,
      title: "مؤتمر التقنية",
      date: "5 يوليو 2025",
      location: "الدمام",
      seatsAvailable: 200,
      description:
        "تعرف على أحدث الابتكارات التكنولوجية بمشاركة خبراء عالميين.",
      image: "https://via.placeholder.com/400x250?text=مؤتمر+التقنية",
    },
  ];

  return (
    <Container
      className="py-5"
      style={{ backgroundColor: "#121212", minHeight: "100vh" }}
    >
      <h2 className="text-warning mb-5 text-center">الأحداث المتوفرة</h2>
      <Row>
        {events.map((event) => (
          <Col md={4} key={event.id} className="mb-4">
            <Card bg="dark" text="white" className="shadow h-100">
              <Card.Img variant="top" src={event.image} alt={event.title} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-warning">{event.title}</Card.Title>
                <Card.Text style={{ flexGrow: 1 }}>
                  <small className="text-muted">
                    📅 {event.date} | 📍 {event.location}
                  </small>
                  <br />
                  <span>{event.description}</span>
                  <br />
                  <Badge bg="warning" text="dark" className="mt-3">
                    عدد المقاعد المتوفرة: {event.seatsAvailable}
                  </Badge>
                </Card.Text>
                <Button variant="warning" className="w-100 mt-auto">
                  احجز الآن
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;