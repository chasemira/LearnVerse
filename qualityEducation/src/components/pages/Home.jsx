import React from 'react';
import '../../App.css';
import './Home.css';
import educImg1 from './home-pics/educ.jpg';
import educImg2 from './home-pics/educ2.jpg';
import educImg3 from './home-pics/educ3.jpg';
import educImg4 from './home-pics/educ4.webp';
import educImg5 from './home-pics/educ5.jpg';
import educImg6 from './home-pics/educ6.jpg';
import educImg7 from './home-pics/educ7.jpeg';
import educImg8 from './home-pics/educ8.jpg';

export default function Home() {
  return (
    <div>
      <section className="images-loop">
        <div className="image-container">
          <img src={educImg1} alt="Education 1" />
          <img src={educImg2} alt="Education 2" />
          <img src={educImg3} alt="Education 3" />
          <img src={educImg4} alt="Education 4" />
          <img src={educImg5} alt="Education 5" />
          <img src={educImg6} alt="Education 6" />
          <img src={educImg7} alt="Education 7" />
          <img src={educImg8} alt="Education 8" />
          {/* Duplicate images for seamless loop */}
          <img src={educImg1} alt="Education 1" />
          <img src={educImg2} alt="Education 2" />
          <img src={educImg3} alt="Education 3" />
          <img src={educImg4} alt="Education 4" />
          <img src={educImg5} alt="Education 5" />
          <img src={educImg6} alt="Education 6" />
          <img src={educImg7} alt="Education 7" />
          <img src={educImg8} alt="Education 8" />
        </div>
        <div className="overlay-text">
          <h1>Empowering Education for All</h1>
          <p>Providing accessible and free educational resources to marginalized communities</p>
        </div>
      </section>

      {/* flip cards  */}
      <section className="flip-card">
        <div className="card">
          <div className="front-page">
            <div className="card-info">
              <h2 className="card-title">Resources</h2>
              <p className="card-subtitle">Explore most popular courses!</p>
            </div>
          </div>

          <div className="back-page">
            <div className="card-content">
              <h3>Skill Exchange</h3>
              <p className="card-description">Exchange Crochet skills for Math!</p>
              <button className="card-button">Explore More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}