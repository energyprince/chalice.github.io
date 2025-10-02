import React from 'react';
import './Home.css';
import profile from '../assets/IMG_7912.png';

function Home() {
  return (
    <div className="home-root">
      <div id="dhead" className="container">
        <div className="row">
          <div id="dpic">
            <div className="ppic-wrap">
              <img
                src={profile}
                alt="profile"
                className="ppic ppic-zoom"
              />
            </div>
          </div>
          <div id="ddesc">
            <h1>Leonardo A. Cruz</h1>
            <h2>I like to build in public and am currently focused on producing more clean energy.</h2>
            <div id="dico">
              <a href="https://x.com/" target="_blank" rel="noreferrer" title="Twitter"><span className="iico">X</span></a>
              <a href="https://github.com/" target="_blank" rel="noreferrer" title="GitHub"><span className="iico">GH</span></a>
              <a href="#blog" title="Blog"><span className="iico">BL</span></a>
              <a href="mailto:hello@example.com" title="Email"><span className="iico">@</span></a>
            </div>
            <div id="demail"></div>
          </div>
        </div>
      </div>

      <hr />

      <div id="history" className="container">
        <div className="entry row">
          <div className="timespan">2025 -</div>
          <div className="ico">
            <div className="entry-dot"></div>
            <div className="ico-img" />
          </div>
          <div className="desc">
            <div className="htxt">
              Welcome to our collection. Hand-crafted pieces and experiences.
            </div>
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2024</div>
          <div className="ico">
            <div className="entry-dot"></div>
            <div className="ico-img" />
          </div>
          <div className="desc">
            Launched the first prototypes and early drops.
          </div>
        </div>
      </div>

      <div className="section-gray">
        <div id="featured-talks" className="container">
          <div className="ctitle">featured</div>
          <div className="row cards">
            {[1,2,3,4].map((i) => (
              <div className="card" key={i}>
                <a href="#blog">
                  <div className="ccimg"><div className="ccimg-ph" /></div>
                </a>
                <div className="cdesc">Card {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: 40 }}>
        <div className="ctitle">about</div>
        <p style={{ lineHeight: 1.6 }}>
          This is a placeholder home layout inspired by the design you shared. Replace
          copy, images, and links as needed.
        </p>
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

export default Home;
