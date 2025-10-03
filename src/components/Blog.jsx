import React from 'react';
import './Blog.css';
import blogImage from '../assets/output_displacement_no_white.png';

function Blog({ onShowExperience }) {
  return (
    <div className="blog-root">
      <main className="blog-page">
        <div className="blog-wrapper">
          <img
            src={blogImage}
            alt="Chalice displacement art"
            className="blog-hero"
            width={300}
          />

          <header className="blog-header">
            <h1>Chalice</h1>
            <p>
              <span className="blog-highlight">
                The cleanest terawatt is the one that is never used
              </span>
              <br />
              <br />
              bullish on prediction markets, AI energy management, AGI 2032, RL on humanoids, manufacturing
              <br />
              <br />
              &gt; Gaithersburg, MD (this updates with my actual location + monte carlo simulation)
              <br />
              <br />
              <button type="button" className="blog-cta-link" onClick={onShowExperience}>
                𐃯 check this cool thing out
              </button>
              <br />
              <br />
              current projects: tooling manufacturing + demand response + battery
              <br />
              <br />
              dislikes: fusion haters
            </p>
          </header>

          <ul className="blog-list">
            <li>
              <b>articles</b>
              <ul>
                <li><a href="#experience">chalice token &gt;</a></li>
                <li><a href="#home">yr 0 &gt;</a></li>
                <li><a href="#home">yr 1 &gt;</a></li>
              </ul>
            </li>

            <li>
              <b>my links</b>
              <ul>
                <li><a href="https://x.com/chaliceofenergy">X</a></li>
                <li><a href="https://instagram.com/yourusername">Youtube</a></li>
                <li><a href="mailto:your@email.com">email</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Blog;
