import { Link } from 'react-router-dom';
import { PageHeader } from '../components/Cards.jsx';

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" subtitle="The page you are looking for does not exist or has been moved." />
      <section className="section"><div className="container"><Link to="/" className="btn btn-primary">Back to home</Link></div></section>
    </>
  );
}
