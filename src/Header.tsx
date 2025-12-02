import { FiRefreshCw } from 'react-icons/fi';
import './Header.css';
import DateDisplay from './DateDisplay';
import Logo from './Logo';
import MorgonkartanLogo from './MorgonkartanLogo';

interface HeaderProps {
  onRefresh: () => void;
  lastUpdated: Date | null;
}

const Header = ({ onRefresh, lastUpdated }: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <Logo />
      </div>
      <div className="header-center">
      <MorgonkartanLogo />
      </div>
      <div className="header-right">
        <DateDisplay lastUpdated={lastUpdated} />
        <button className="refresh-button" onClick={onRefresh}>
          <FiRefreshCw />
        </button>
      </div>
    </header>
  );
};

export default Header;
