/**
 * Home page wrapper.
 * Renders Navbar, HomePage content, BottomNav, and PremiumModal.
 */
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import HomePage from '../components/home/HomePage';
import PremiumModal from '../components/modals/PremiumModal';

export default function Home() {
  return (
    <div className="page-with-bottom-nav">
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto' }}>
        <HomePage />
      </main>
      <BottomNav />
      <PremiumModal />
    </div>
  );
}
