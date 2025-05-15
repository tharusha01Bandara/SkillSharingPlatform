import React from "react";
import { Link } from "react-router-dom";


const Head = () => {
  return (
    <div>
      <section className="head">
        <div className="container flexSB">
          <div className="logo">
            <h1>EduBridge</h1>
            <span>ONLINE EDUCATION & LEARNING</span>
          </div>

          <div className="top-right">
            <div className="social">
              <i className="fab fa-facebook-f icon"></i>
              <i className="fab fa-instagram icon"></i>
              <i className="fab fa-twitter icon"></i>
              <i className="fab fa-youtube icon"></i>

            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Head;
