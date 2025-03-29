import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import
import './Home.css';
import educImg1 from './home-pics/educ.jpg';
import educImg2 from './home-pics/educ2.jpg';
import educImg3 from './home-pics/educ3.jpg';
import educImg4 from './home-pics/educ4.webp';

export default function Home() {
  const resourcesRef = useRef(null);
  const cardsRef = useRef([]);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navigate = useNavigate();  // Add this line to use navigation

  useEffect(() => {
    // Function to check if element is in viewport
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
      );
    };

    // Function to check if element is out of viewport (scrolled up)
    const isOutOfViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top > (window.innerHeight || document.documentElement.clientHeight) * 0.9
      );
    };

    // Function to handle scroll and add/remove visible class
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const scrollingDown = st > lastScrollTop;
      setLastScrollTop(st);

      // For Resources title
      if (resourcesRef.current) {
        if (scrollingDown && isInViewport(resourcesRef.current)) {
          resourcesRef.current.classList.add('visible');
        } else if (!scrollingDown && isOutOfViewport(resourcesRef.current)) {
          resourcesRef.current.classList.remove('visible');
        }
      }

      // For Cards
      cardsRef.current.forEach(card => {
        if (card) {
          if (scrollingDown && isInViewport(card)) {
            card.classList.add('visible');
          } else if (!scrollingDown && isOutOfViewport(card)) {
            card.classList.remove('visible');
          }
        }
      });
    };

    // Initial check on load
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  // Function to add each card to the ref array
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div>
      <section className="images-loop">
        <div className="image-container">
          <img src={educImg1} alt="Education 1" />
          <img src={educImg2} alt="Education 2" />
          <img src={educImg3} alt="Education 3" />
          <img src={educImg4} alt="Education 4" />
          <img src={educImg1} alt="Education 1" />
          <img src={educImg2} alt="Education 2" />
          <img src={educImg3} alt="Education 3" />
          <img src={educImg4} alt="Education 4" />
        </div>
        <div className="overlay-text">
          <h1>Empowering Education for All</h1>
          <p>Providing accessible and free educational resources to marginalized communities</p>
        </div>
      </section>

      {/* Featured resources */}
      <section>
        <div className="resources" ref={resourcesRef}>
          <h2>Featured Resources</h2>
        </div>
      </section>

      {/* Flip cards */}
      <section className="flip-card-container">
        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <h2 className="card-title">Skills Marketplace</h2>
              <p className="card-subtitle">Explore new skills in exchange with yours! </p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>Skill Exchange</h3>
              <p className="card-description">Exchange Crochet skills for Math!</p>
              <button className="card-button" onClick={() => navigate('/skills')}>Explore More</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <h2 className="card-title">Translations</h2>
              <p className="card-subtitle">Join interactive workshops!</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>Hands-On Learning</h3>
              <p className="card-description">Learn practical skills in real-time!</p>
              <button className="card-button">Join Now</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <h2 className="card-title">Connect</h2>
              <p className="card-subtitle">Connect with people!</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>Guided Learning</h3>
              <p className="card-description">Get personalized guidance from experts!</p>
              <button className="card-button">Learn More</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <h2 className="card-title">Community</h2>
              <p className="card-subtitle">Join our learning community!</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>Collaborate</h3>
              <p className="card-description">Work together to achieve your goals!</p>
              <button className="card-button">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>We are dedicated to providing accessible educational resources to underserved communities, bridging the knowledge gap and empowering individuals through education.</p>
          </div>
          
          <div className="footer-section">
            <h3>Our Mission</h3>
            <p>To create an inclusive learning environment where everyone has equal opportunity to access quality education regardless of their background or circumstances.</p>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <p><i className="far fa-envelope"></i> LearnVerse@gmail.com</p>
              <p><i className="fas fa-phone"></i> +1 (236) 123-4567</p>
              <p><i className="fas fa-map-marker-alt"></i> Simon Fraser University, Burnaby, BC</p>
            </div>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 A Universe of Learning Opportunities. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}