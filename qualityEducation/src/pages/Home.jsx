import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import
import './Home.css';
import educImg1 from './home-pics/educ.jpg';
import educImg2 from './home-pics/educ2.jpg';
import educImg3 from './home-pics/educ3.jpg';
import educImg4 from './home-pics/educ4.webp';
import skillsCardImg from './home-pics/skills-card.png';
import translationCardImg from './home-pics/translation-card.png';
import connectCardImg from './home-pics/connect-card.png';
import communityCardImg from './home-pics/community-card.png';
import { useTranslatedLabels } from '../hooks/useTranslatedLabels';

export default function Home() {
  const resourcesRef = useRef(null);
  const cardsRef = useRef([]);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const navigate = useNavigate();  // Add this line to use navigation
  const labels = useTranslatedLabels(
    useMemo(
      () => ({
        heroTitle: 'Empowering Education for All',
        heroSubtitle:
          'Providing accessible and free educational resources to marginalized communities',
        featuredResources: 'Featured Resources',
        skillsMarketplace: 'Skills Marketplace',
        skillsSubtitle: 'Explore new skills in exchange with yours!',
        skillExchange: 'Skill Exchange',
        skillExchangeDesc: 'Exchange Crochet skills for Math!',
        exploreMore: 'Explore More',
        translations: 'Translations',
        translationsSubtitle: 'Join interactive workshops!',
        handsOnLearning: 'Hands-On Learning',
        handsOnLearningDesc: 'Learn practical skills in real-time!',
        joinNow: 'Join Now',
        connect: 'Connect',
        connectSubtitle: 'Connect with people!',
        guidedLearning: 'Guided Learning',
        guidedLearningDesc: 'Get personalized guidance from experts!',
        learnMore: 'Learn More',
        community: 'Community',
        communitySubtitle: 'Join our learning community!',
        collaborate: 'Collaborate',
        collaborateDesc: 'Work together to achieve your goals!',
        getStarted: 'Get Started',
        aboutUs: 'About Us',
        aboutUsDesc:
          'We are dedicated to providing accessible educational resources to underserved communities, bridging the knowledge gap and empowering individuals through education.',
        ourMission: 'Our Mission',
        ourMissionDesc:
          'To create an inclusive learning environment where everyone has equal opportunity to access quality education regardless of their background or circumstances.',
        contactUs: 'Contact Us',
        footerCopyright:
          '© 2025 A Universe of Learning Opportunities. All rights reserved.',
      }),
      []
    )
  );

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
    <div className="home-page">
      <div className="space-bg" aria-hidden="true">
        <span className="space-glow"></span>
        <span className="stars stars-slow"></span>
        <span className="stars stars-fast"></span>
      </div>
      <div className="home-content">
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
          <h1>{labels.heroTitle}</h1>
          <p>{labels.heroSubtitle}</p>
        </div>
      </section>

      {/* Featured resources */}
      <section>
        <div className="resources" ref={resourcesRef}>
          <h2>{labels.featuredResources}</h2>
        </div>
      </section>

      {/* Flip cards */}
      <section className="flip-card-container">
        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <div className="card-media">
                <img
                  src={skillsCardImg}
                  alt="3D skills marketplace illustration"
                />
              </div>
              <h2 className="card-title">{labels.skillsMarketplace}</h2>
              <p className="card-subtitle">{labels.skillsSubtitle}</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>{labels.skillExchange}</h3>
              <p className="card-description">{labels.skillExchangeDesc}</p>
              <button className="card-button" onClick={() => navigate('/skills')}>{labels.exploreMore}</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <div className="card-media">
                <img
                  src={translationCardImg}
                  alt="3D translation illustration"
                />
              </div>
              <h2 className="card-title">{labels.translations}</h2>
              <p className="card-subtitle">{labels.translationsSubtitle}</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>{labels.handsOnLearning}</h3>
              <p className="card-description">{labels.handsOnLearningDesc}</p>
              <button className="card-button">{labels.joinNow}</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <div className="card-media">
                <img
                  src={connectCardImg}
                  alt="3D connection illustration"
                />
              </div>
              <h2 className="card-title">{labels.connect}</h2>
              <p className="card-subtitle">{labels.connectSubtitle}</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>{labels.guidedLearning}</h3>
              <p className="card-description">{labels.guidedLearningDesc}</p>
              <button className="card-button">{labels.learnMore}</button>
            </div>
          </div>
        </div>

        <div className="card" ref={addToRefs}>
          <div className="front-page">
            <div className="card-info">
              <div className="card-media">
                <img
                  src={communityCardImg}
                  alt="3D community illustration"
                />
              </div>
              <h2 className="card-title">{labels.community}</h2>
              <p className="card-subtitle">{labels.communitySubtitle}</p>
            </div>
          </div>
          <div className="back-page">
            <div className="card-content">
              <h3>{labels.collaborate}</h3>
              <p className="card-description">{labels.collaborateDesc}</p>
              <button className="card-button">{labels.getStarted}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-aurora footer-aurora-left" aria-hidden="true"></div>
        <div className="footer-content">
          <div className="footer-section">
            <h3>{labels.aboutUs}</h3>
            <p>{labels.aboutUsDesc}</p>
          </div>
          
          <div className="footer-section">
            <h3>{labels.ourMission}</h3>
            <p>{labels.ourMissionDesc}</p>
          </div>
          
          <div className="footer-section">
            <h3>{labels.contactUs}</h3>
            <div className="contact-info">
              <p><i className="far fa-envelope"></i> LearnVerse@gmail.com</p>
              <p><i className="fas fa-phone"></i> +1 (236) 123-4567</p>
              <p><i className="fas fa-map-marker-alt"></i> Simon Fraser University, Burnaby, BC</p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>{labels.footerCopyright}</p>
        </div>
      </footer>
      </div>
    </div>
  );
}