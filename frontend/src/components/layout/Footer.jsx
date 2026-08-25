import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h6>FoodTrack</h6>
            <p>Smart food management for a better future.</p>
          </div>
          <div className="col-md-3">
            <h6>Product</h6>
            <ul className="list-unstyled">
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Company</h6>
            <ul className="list-unstyled">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Legal</h6>
            <ul className="list-unstyled">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <small>&copy; 2025 FoodTrack. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
