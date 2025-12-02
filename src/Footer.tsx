
import { FaLinkedin, FaLink, FaInfoCircle } from 'react-icons/fa';
import './Footer.css';

interface FooterProps {
  onInfoClick: () => void;
}

const Footer = ({ onInfoClick }: FooterProps) => {
  return (
    <footer className="site-footer">
      <div>
        <a href="https://www.linkedin.com/company/total-digital-it-solutions" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={30} />
        </a>
        <a href="https://www.totaldigital.se" target="_blank" rel="noopener noreferrer">
          <FaLink size={30} />
        </a>
      </div>
      <button onClick={onInfoClick} className="info-button">
        <FaInfoCircle size={30} />
      </button>
    </footer>
  );
};

export default Footer;
