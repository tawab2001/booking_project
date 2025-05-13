import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className=" mb-4 font-weight-bold text-warning">EasyTicket</h5>
            <p>
            "Life’s too short to miss epic concerts. From top artists to hidden gems — grab your crew, pick your show, and turn up the volume!"
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h5>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>About Us</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Booking</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Events</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Contact Us</a></p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Support</h5>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>FAQs</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Privacy Policy</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Terms & Conditions</a></p>
            <p><a href="#" className="text-white" style={{ textDecoration: 'none' }}>Booking Guide</a></p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h5>
            <p><i className="fas fa-home mr-3"></i> 123 Travel Street, Tourism City</p>
            <p><i className="fas fa-envelope mr-3"></i> info@easyticket.com</p>
            <p><i className="fas fa-phone mr-3"></i> +1 234 567 890</p>
          </div>
        </div>

        <hr className="mb-4" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p>© 2025 EasyTicket. All rights reserved.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;