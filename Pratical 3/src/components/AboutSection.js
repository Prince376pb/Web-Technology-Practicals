import React from "react";

export default function AboutSection() {
  const features = [
    {
      title: "Direct & Commission-Free",
      description:
        "Labour Connect eliminates middleman agencies. Clients directly phone or email service workers, ensuring full earnings for workers and fair prices for clients.",
      icon: "🤝"
    },
    {
      title: "Diverse Skilled Trades",
      description:
        "Covering essential trades including plumbing, electrical work, carpentry, automobile mechanics, house painting, and home appliance repairs.",
      icon: "🔧"
    },
    {
      title: "Local Community Connection",
      description:
        "Enables quick response times for emergency repairs and home improvement tasks by matching requests with workers in the same neighborhood.",
      icon: "📍"
    },
    {
      title: "Technology",
      description:
        "Built using React 19 functional components, React Hooks (useState, useEffect, useMemo), controlled inputs, client-side validation, and browser localStorage persistence.",
      icon: "💻"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Register Profile",
      desc: "Skilled workers register with their name, trade skill, experience, contact details, and locality."
    },
    {
      step: "02",
      title: "Instant Listing",
      desc: "The profile immediately appears in the searchable local directory with dynamic metrics updating live."
    },
    {
      step: "03",
      title: "Direct Hiring",
      desc: "Clients search or filter by trade and locality, then initiate contact immediately via phone or email."
    }
  ];

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-eyebrow">About the Platform</span>
          <h2 className="section-title">Empowering Local Blue-Collar Trades</h2>
          <p className="section-subtitle">
            A  web application connecting skilled independent tradespeople with households and businesses in need of immediate service.
          </p>
        </div>

        <div className="about-features-grid">
          {features.map((feat, index) => (
            <div key={index} className="about-feature-card">
              <div className="about-feature-icon">{feat.icon}</div>
              <h3 className="about-feature-title">{feat.title}</h3>
              <p className="about-feature-desc">{feat.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Workflow */}
        <div className="how-it-works-box">
          <h3 className="how-title">How Labour Connect Works</h3>
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.step} className="step-card">
                <div className="step-number">{s.step}</div>
                <h4 className="step-heading">{s.title}</h4>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Notice Banner */}
        <div className="demo-architecture-banner">
          <div className="demo-architecture-icon">⚙️</div>
          <div className="demo-architecture-text">
            <h4>Demonstration Notice & Data Persistence</h4>
            <p>
              Worker records are managed purely on the client side using React state and persisted across browser sessions via{" "}
              <code>localStorage</code>. No proprietary third-party backend or subscription is needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
