import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext.jsx';
import { PageHeader } from '../components/Cards.jsx';
import Mark from '../components/Mark.jsx';

export default function About() {
  const { settings: s } = useSettings();
  return (
    <>
      <PageHeader title={`About ${s.siteName}`} subtitle={s.tagline} />
      <section className="section">
        <div className="container about">
          <div>
            <h2>{s.aboutTitle}</h2>
            {s.aboutText.split('\n').filter(Boolean).map((p, i) => <p className="prose" key={i}>{p}</p>)}
            <Link to="/contact" className="btn btn-primary">Work with us</Link>
          </div>
          <div className="about-art" aria-hidden="true"><Mark className="about-mark" /></div>
        </div>
      </section>
    </>
  );
}
