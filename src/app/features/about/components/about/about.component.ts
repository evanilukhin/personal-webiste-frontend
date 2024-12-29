import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="about-container">
      <div class="profile-section">
        <div class="profile-image">
          <img src="assets/profile.jpg" alt="Ivan Iliukhin">
        </div>
        <div class="profile-info">
          <h1>Ivan Iliukhin</h1>
          <p class="title">Senior Software Engineer at Codeium</p>
          <p class="location">Berlin, Germany</p>
          <div class="social-links">
            <a href="https://github.com/evanilukhin" target="_blank" mat-icon-button>
              <mat-icon svgIcon="github"></mat-icon>
            </a>
            <a href="https://www.linkedin.com/in/evanilukhin/" target="_blank" mat-icon-button>
              <mat-icon svgIcon="linkedin"></mat-icon>
            </a>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <mat-tab-group>
        <!-- About Tab -->
        <mat-tab label="About">
          <div class="tab-content">
            <h2>About Me</h2>
            <p>
              Software Engineer with over 8 years of experience in backend development, specializing in Ruby and Python.
              Currently focused on building AI-powered developer tools at Codeium. Passionate about creating efficient,
              scalable solutions and mentoring fellow developers.
            </p>
          </div>
        </mat-tab>

        <!-- Experience Tab -->
        <mat-tab label="Experience">
          <div class="tab-content">
            <div class="experience-card">
              <h3>Senior Software Engineer</h3>
              <p class="company">Codeium · Full-time</p>
              <p class="period">Mar 2023 - Present · 10 mos</p>
              <p class="location">Berlin, Germany</p>
              <p class="description">
                Building AI-powered developer tools at Codeium, focusing on backend development and system architecture.
              </p>
              <mat-chip-set>
                <mat-chip>Python</mat-chip>
                <mat-chip>Backend Development</mat-chip>
                <mat-chip>AI Tools</mat-chip>
              </mat-chip-set>
            </div>

            <mat-divider></mat-divider>

            <div class="experience-card">
              <h3>Senior Ruby Developer</h3>
              <p class="company">Evil Martians · Full-time</p>
              <p class="period">Feb 2021 - Feb 2023 · 2 yrs 1 mo</p>
              <p class="location">Remote</p>
              <p class="description">
                Worked on various client projects, focusing on Ruby development and technical leadership.
              </p>
              <mat-chip-set>
                <mat-chip>Ruby</mat-chip>
                <mat-chip>Ruby on Rails</mat-chip>
                <mat-chip>PostgreSQL</mat-chip>
                <mat-chip>Technical Leadership</mat-chip>
              </mat-chip-set>
            </div>

            <mat-divider></mat-divider>

            <div class="experience-card">
              <h3>Senior Ruby Developer</h3>
              <p class="company">FUNBOX · Full-time</p>
              <p class="period">Sep 2017 - Feb 2021 · 3 yrs 6 mos</p>
              <p class="location">Ulyanovsk, Russia</p>
              <p class="description">
                Led development of web applications and microservices using Ruby and related technologies.
              </p>
              <mat-chip-set>
                <mat-chip>Ruby</mat-chip>
                <mat-chip>Ruby on Rails</mat-chip>
                <mat-chip>Microservices</mat-chip>
                <mat-chip>Web Development</mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </mat-tab>

        <!-- Skills Tab -->
        <mat-tab label="Skills">
          <div class="tab-content">
            <div class="skills-section">
              <h3>Technical Skills</h3>
              <mat-chip-set>
                <mat-chip>Ruby</mat-chip>
                <mat-chip>Python</mat-chip>
                <mat-chip>Ruby on Rails</mat-chip>
                <mat-chip>PostgreSQL</mat-chip>
                <mat-chip>Git</mat-chip>
                <mat-chip>Docker</mat-chip>
                <mat-chip>Linux</mat-chip>
              </mat-chip-set>

              <h3>Areas of Expertise</h3>
              <mat-chip-set>
                <mat-chip>Backend Development</mat-chip>
                <mat-chip>Web Development</mat-chip>
                <mat-chip>Technical Leadership</mat-chip>
                <mat-chip>Microservices</mat-chip>
                <mat-chip>System Design</mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </mat-tab>

        <!-- Education Tab -->
        <mat-tab label="Education">
          <div class="tab-content">
            <div class="education-card">
              <h3>Ulyanovsk State Technical University</h3>
              <p class="degree">Bachelor's degree, Software Engineering</p>
              <p class="period">2011 - 2015</p>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .profile-section {
      display: flex;
      gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;

      .profile-image {
        img {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      }

      .profile-info {
        h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem;
          color: #2c3e50;
        }

        .title {
          font-size: 1.25rem;
          color: #34495e;
          margin: 0 0 0.5rem;
        }

        .location {
          color: #7f8c8d;
          margin: 0 0 1rem;
        }

        .social-links {
          display: flex;
          gap: 0.5rem;

          a {
            color: #34495e;
            transition: all 0.2s ease;

            &:hover {
              color: #3498db;
              transform: translateY(-2px);
            }
          }
        }
      }
    }

    .tab-content {
      padding: 2rem 0;

      h2 {
        font-size: 2rem;
        margin: 0 0 1rem;
        color: #2c3e50;
      }

      h3 {
        font-size: 1.5rem;
        margin: 2rem 0 1rem;
        color: #2c3e50;

        &:first-child {
          margin-top: 0;
        }
      }

      p {
        line-height: 1.6;
        color: #34495e;
        margin: 0 0 1rem;
      }
    }

    .experience-card {
      padding: 2rem 0;

      h3 {
        margin: 0 0 0.5rem;
      }

      .company {
        font-size: 1.1rem;
        color: #34495e;
        margin: 0 0 0.25rem;
      }

      .period,
      .location {
        color: #7f8c8d;
        margin: 0 0 1rem;
      }

      .description {
        margin: 0 0 1rem;
      }

      mat-chip-set {
        margin-bottom: 1rem;
      }
    }

    .skills-section {
      mat-chip-set {
        margin-bottom: 2rem;
      }
    }

    .education-card {
      h3 {
        margin: 0 0 0.5rem;
      }

      .degree {
        color: #34495e;
        margin: 0 0 0.25rem;
      }

      .period {
        color: #7f8c8d;
      }
    }

    mat-divider {
      margin: 2rem 0;
    }

    @media (max-width: 768px) {
      .profile-section {
        flex-direction: column;
        text-align: center;

        .profile-info {
          h1 {
            font-size: 2rem;
          }
        }

        .social-links {
          justify-content: center;
        }
      }

      .tab-content {
        padding: 1.5rem 0;

        h2 {
          font-size: 1.75rem;
        }

        h3 {
          font-size: 1.25rem;
        }
      }
    }
  `]
})
export class AboutComponent {}
