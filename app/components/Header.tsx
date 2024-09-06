import React from "react";

export default function Component() {
  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.textCenter}>
          {/* Gradient Text Heading */}
          <h1 style={styles.heading}>QuizWiz</h1>
          <div style={styles.relative}>
            <div style={styles.textWrapper}>
              <p style={styles.description}>
                Create fun and engaging music quizzes in no time with our AI-powered tool. Pick a theme and let the
                magic happen!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Styles using plain CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
  section: {
    background: 'url("/dots-pattern.svg") repeat', // SVG background with spaced out dots
    backgroundColor: "#000",
    backgroundSize: "50px 50px", // Size of the dots pattern
    padding: "50px 20px", // Add some spacing around the section
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  textCenter: {
    textAlign: "center",
  },
  heading: {
    backgroundImage: "linear-gradient(to right, #ff6b6b, #ffa500)", // Gradient text
    backgroundClip: "text",
    color: "transparent",
    fontSize: "4rem", // Adjust size for responsiveness
    fontWeight: "800", // Extra bold text
    letterSpacing: "-1px", // Slightly tighten letter spacing
    WebkitBackgroundClip: "text",
    margin: "0 0 20px", // Margin bottom to separate from the paragraph
  },
  relative: {
    position: "relative",
  },
  textWrapper: {
    position: "relative",
    zIndex: 10,
    padding: "20px", // Add some padding around the text
  },
  description: {
    fontSize: "1.25rem",
    color: "#f5f5f5", // Dark text for readability
    maxWidth: "600px",
    margin: "0 auto",
  },
};
