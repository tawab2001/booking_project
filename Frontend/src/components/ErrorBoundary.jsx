import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="display-1 mb-4">😕</h1>
        <h2 className="mb-4">Oops! Something went wrong</h2>
        
        <Alert variant="danger" className="mb-4">
          {error?.status === 404 ? (
            <div>
              <h4>Page Not Found</h4>
              <p>Sorry, we couldn't find the page you're looking for.</p>
            </div>
          ) : (
            <div>
              <h4>Error {error?.status || 'Unknown'}</h4>
              <p>{error?.message || 'An unexpected error occurred.'}</p>
            </div>
          )}
        </Alert>

        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant="primary" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ErrorBoundary; 