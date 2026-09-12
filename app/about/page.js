export default function About() {
  return (
    <div className="page-container">
      <section className="page-header">
        <span className="section-label-heading">ABOUT</span>

        <h1>About PhonoPlay</h1>

        <p>
          Learn more about the project, its purpose and the
          technologies used to build it.
        </p>
      </section>

      <section className="content-card">
        <h2>What is PhonoPlay?</h2>

        <p>
          PhonoPlay is a frontend activity builder designed for
          Speech Pathology teachers and students. It provides a
          simple interface for creating phoneme-based classroom
          activities.
        </p>

        <p>
          The builder allows teachers to configure an activity,
          preview the result and generate a standalone HTML file
          that can be opened in a normal web browser.
        </p>
      </section>

      <div className="two-column-content">
        <section className="content-card">
          <div className="card-icon">🔤</div>

          <h2>Phoneme Wordle</h2>

          <p>
            A Wordle-style activity where learners work with
            phoneme symbols rather than conventional spelling.
            Interactive hints provide the corresponding English
            letter or sound representation.
          </p>
        </section>

        <section className="content-card">
          <div className="card-icon">🔎</div>

          <h2>Phoneme Word Search</h2>

          <p>
            A word search activity based on phoneme sequences.
            Assessment 1 uses a small fixed set of phoneme-based
            words, with more advanced word management planned for
            later assessments.
          </p>
        </section>
      </div>

      <section className="content-card developer-card">
        <span className="section-label">DEVELOPER</span>

        <h2>Joshua Furr</h2>

        <p>
          Student Number: 22330407
        </p>

        <p>
          Assessment 2 - Backend implementation and database integration
        </p>
      </section>

      <section className="content-card">
        <span className="section-label">DEMONSTRATION</span>

        <h2>Project Demonstration</h2>
        
          <iframe width="560" 
                  height="315" 
                  src="https://www.youtube.com/embed/bSLaBddGfYs?si=vcmphNgNaKYdNETG" 
                  title="YouTube video player" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" 
                  allowfullscreen>  
          </iframe>
        
      </section>
    </div>
  );
}