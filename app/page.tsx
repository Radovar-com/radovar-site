import { Spotlight } from "./_components/Spotlight"

const NAV = [
  { href: "#creator", label: "Creator" },
  { href: "#principles", label: "Principles" },
  { href: "#company", label: "Company" },
]

function Arrow() {
  return <span className="btn__arrow" aria-hidden="true">&rarr;</span>
}

export default function HomePage() {
  return (
    <>
      <header className="nav">
        <div className="shell nav__inner">
          <a className="wordmark" href="#top">Radovar</a>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <a className="btn btn--ghost btn--sm nav__cta" href="mailto:info@radovar.com">
            Contact us
          </a>

          {/* Narrow viewports: native disclosure, no JavaScript. */}
          <details className="nav__menu">
            <summary className="nav__toggle" aria-label="Open menu">
              <span className="nav__bars" aria-hidden="true">
                <span /><span /><span />
              </span>
              Menu
            </summary>
            <nav className="nav__panel" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
              <a href="mailto:info@radovar.com">Contact us</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="top">
        {/* Hero: drifting colour field and a hairline grid behind large type. */}
        <section className="hero">
          {/* Full-bleed: the colour field and grid run edge to edge, while the
              content stays inside the shell. */}
          <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
          <div className="gridlines" aria-hidden="true" />

          <div className="hero__grid shell">
            <h1 className="lift" style={{ "--i": 0 } as React.CSSProperties}>
              AI that runs on <em>your</em> machine.
            </h1>
            <div className="hero__side lift" style={{ "--i": 1 } as React.CSSProperties}>
              <p className="hero__lede">
                Radovar builds local-first AI. Creator, our desktop application, runs agents
                on your computer and keeps your code there.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#creator">Explore Creator<Arrow /></a>
                <a className="btn btn--ghost" href="#company">About Radovar</a>
              </div>
            </div>
          </div>
        </section>

        {/* Creator: the dark block carries the visual weight of the page. */}
        <section className="shell" id="creator">
          <div className="block reveal">
            <div className="gridlines" aria-hidden="true" />
            <Spotlight />

            <div className="block__grid">
              <div>
                <p className="eyebrow">Our product</p>
                <h2>Creator turns a local machine into an AI workstation.</h2>
              </div>
              <div>
                <p className="block__body">
                  Creator connects AI agents to a real project on disk. They read the files,
                  propose changes, and run the checks, in the same place you already work.
                </p>
                <p className="block__body">
                  Nothing is uploaded in order to run. That makes it usable in teams where
                  sending source code to a third party was never an option.
                </p>
              </div>
            </div>

            <div className="block__facts">
              <div className="fact">
                <h3>Runs on the desktop</h3>
                <p>A native application, not a browser tab pointed at someone else server.</p>
              </div>
              <div className="fact">
                <h3>Works on real files</h3>
                <p>Agents open the actual project, not a copy pasted into a chat window.</p>
              </div>
              <div className="fact">
                <h3>Local models supported</h3>
                <p>Run against a model on your own hardware when the work cannot leave.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles: grouped hairline list. */}
        <section className="shell section" id="principles">
          <h2 className="principles__head reveal">What we hold to, product after product.</h2>
          <div className="principles__list">
            <div className="principle reveal">
              <h3>Local by default</h3>
              <p>
                The useful path is the private one. Running locally is the normal mode, not a
                restricted mode you have to ask for.
              </p>
            </div>
            <div className="principle reveal">
              <h3>Your code stays yours</h3>
              <p>
                No silent copies, no training on your work, no exceptions buried in a settings
                panel.
              </p>
            </div>
            <div className="principle reveal">
              <h3>Real files, real results</h3>
              <p>
                An agent that cannot open your project cannot help with it. Ours work against
                the actual repository.
              </p>
            </div>
            <div className="principle reveal">
              <h3>Built to be checked</h3>
              <p>
                Every change an agent makes is visible and reviewable before it lands. You stay
                the one who approves.
              </p>
            </div>
          </div>
        </section>

        {/* How it works: four ideas, four cells, four different surfaces. */}
        <section className="shell section">
          <h2 className="bento__head reveal">How Creator actually works.</h2>
          <div className="bento">
            <div className="tile tile--wide tile--accent reveal">
              <h3>Point Creator at a project you already have.</h3>
              <p>
                No migration, no upload step, no new home for your source. Creator opens the
                folder where the work already lives.
              </p>
            </div>
            <div className="tile tile--warm reveal">
              <h3>Agents work in place</h3>
              <p>They read, edit, and run against the real files on disk.</p>
            </div>
            <div className="tile tile--pattern reveal">
              <h3>You review every change</h3>
              <p>Each edit arrives as a diff you approve or reject.</p>
            </div>
            <div className="tile tile--wide tile--outline reveal">
              <h3>Choose the model, including one that never leaves the machine.</h3>
              <p>
                Creator runs against hosted models when you want the power, and against local
                models when the work cannot go anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Company: narrow editorial prose. */}
        <section className="company" id="company">
          <div className="shell section">
            <div className="company__inner">
              <h2 className="reveal">Radovar is the company behind Creator.</h2>
              <p className="company__body reveal">
                We are a small technology company working on one question: how much of modern
                AI tooling can you get without handing over the thing you are working on.
              </p>
              <p className="company__body reveal">
                Most tools answer that by asking you to trust a server. We would rather move
                the capability to where the work already is. That constraint shapes the whole
                product, from how agents get access to files to which models we support.
              </p>
              <p className="company__body reveal">
                Creator is the first thing we have built to that standard. It will not be the
                last.
              </p>
            </div>
          </div>
        </section>

        {/* Contact: single full-width panel. */}
        <section className="shell section">
          <div className="contact__panel reveal">
            <div>
              <h2>Talk to us about Creator.</h2>
              <p className="contact__note">
                Questions about the product, a team rollout, or how the local setup works.
              </p>
            </div>
            <a className="btn btn--onAccent" href="mailto:info@radovar.com">
              Contact us<Arrow />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer__inner">
          <span className="wordmark">Radovar</span>
          <div className="footer__links">
            <a href="#creator">Creator</a>
            <a href="#company">Company</a>
            <a href="mailto:info@radovar.com">info@radovar.com</a>
          </div>
          <span>Bucharest, Romania</span>
        </div>
      </footer>
    </>
  )
}
