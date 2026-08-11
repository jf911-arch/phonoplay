import ActivityCard from "./components/ActivityCard";

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            Speech Pathology Classroom Tool
          </div>

          <h1>
            Build engaging
            <span> phoneme activities.</span>
          </h1>

          <p>
            PhonoPlay is a teacher-focused activity builder for
            creating interactive phoneme-based classroom activities.
            Create, preview and export activities that can run
            directly in a web browser.
          </p>

          <div className="hero-actions">
            <a href="/wordle" className="primary-button">
              Create a Wordle
              <span>→</span>
            </a>

            <a href="/word-search" className="secondary-button">
              Create a Word Search
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phoneme-display">
            <div className="phoneme-label">Today's phonemes</div>

            <div className="phoneme-row">
              <span>/θ/</span>
              <span>/ɪ/</span>
              <span>/n/</span>
            </div>

            <div className="phoneme-hint">
              TH — as in <strong>thin</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="activities-section">
        <div className="section-heading">
          <div>
            <span className="section-label">ACTIVITIES</span>
            <h2>Choose an activity</h2>
          </div>

          <p>
            Select a classroom activity to configure and preview
            your phoneme-based content.
          </p>
        </div>

        <div className="activity-grid">
          <ActivityCard
            icon="🔤"
            title="Phoneme Wordle"
            description="Create a Wordle-style guessing activity using phonemes instead of conventional spelling."
            href="/wordle"
          />

          <ActivityCard
            icon="🔎"
            title="Phoneme Word Search"
            description="Create a word search using a fixed set of phoneme-based words for classroom practice."
            href="/word-search"
          />
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading centered">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Build. Preview. Generate.</h2>
          <p>
            PhonoPlay provides a simple workflow for teachers to
            prepare classroom-ready activities.
          </p>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step">
            <div className="step-number">01</div>
            <h3>Configure</h3>
            <p>
              Choose your activity and customise the available
              phoneme-based settings.
            </p>
          </div>

          <div className="workflow-step">
            <div className="step-number">02</div>
            <h3>Preview</h3>
            <p>
              See how the finished classroom activity will look
              before generating it.
            </p>
          </div>

          <div className="workflow-step">
            <div className="step-number">03</div>
            <h3>Generate</h3>
            <p>
              Download a standalone HTML file that can be opened
              in a normal web browser.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}