export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <h1>Radovar</h1>
        <p className="lede">Innovation in artificial intelligence solutions</p>
        <div className="hero-actions">
          <a className="ds-button ds-button--primary" href="#about">Learn More</a>
        </div>
      </section>

      <section id="about" className="hero-card" style={{ marginTop: '32px' }}>
        <h2>About Radovar</h2>
        <p className="lede">Radovar is a technology company dedicated to creating cutting-edge AI solutions that empower businesses and individuals. Founded in 2020, we have been at the forefront of artificial intelligence development, focusing on local agent technologies and user privacy.</p>
        <p>Our team of experts works tirelessly to deliver innovative products that transform how people interact with technology, always prioritizing security and data protection.</p>
      </section>

      <section id="creator" className="hero-card" style={{ marginTop: '32px' }}>
        <h2>The Creator Product</h2>
        <p className="lede">Creator is a desktop application that works with local AI agents while keeping all code on the user&apos;s machine.</p>
        <p>Our flagship product, Creator, represents a new paradigm in AI development. It enables users to create and deploy AI agents locally, ensuring complete data privacy and control over their information. The application runs entirely on the user&apos;s device, with no external data transmission required.</p>
        <p>With Creator, developers can build sophisticated AI solutions without compromising user privacy or security, making it an ideal choice for organizations that prioritize data protection.</p>
      </section>

      <footer id="contact" className="hero-card" style={{ marginTop: '32px', textAlign: 'center' }}>
        <h2>Contact Us</h2>
        <p>Have questions about our products or services?</p>
        <p>Email us at <a href="mailto:info@radovar.com">info@radovar.com</a></p>
        <p>Based in Bucuresti, Romania</p>
        <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
          <a className="ds-button ds-button--secondary" href="mailto:info@radovar.com">Get in Touch</a>
        </div>
      </footer>
    </main>
  )
}
