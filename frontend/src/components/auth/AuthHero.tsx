import { Link } from 'react-router-dom';
import golfHero from '../../assets/golf.png';

export default function AuthHero() {
  return (
    <Link to="/" className="block relative overflow-hidden w-full h-full group bg-[#062c29]">
      <img 
        src={golfHero} 
        alt="GolfForGood" 
        className="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.02]"
      />
      {/* Subtle overlay to make the hover effect feel interactive */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
    </Link>
  );
}
