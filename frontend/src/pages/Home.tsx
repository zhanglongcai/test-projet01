import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Steps } from '../components/home/Steps';

export const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Steps />
    </main>
  );
};

export default Home;