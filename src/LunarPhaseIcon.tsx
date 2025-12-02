import React from 'react';

interface LunarPhaseIconProps {
  phase: string;
}

const LunarPhaseIcon: React.FC<LunarPhaseIconProps> = ({ phase }) => {
  const getIcon = () => {
    switch (phase) {
      case 'New Moon':
        return '🌑';
      case 'Waxing Crescent':
        return '🌒';
      case 'First Quarter':
        return '🌓';
      case 'Waxing Gibbous':
        return '🌔';
      case 'F':
        return '🌕';
      case 'Waning Gibbous':
        return '🌖';
      case 'Last Quarter':
        return '🌗';
      case 'Waning Crescent':
        return '🌘';
      default:
        return null;
    }
  };

  return <span style={{ fontSize: '1.0rem' }}>{getIcon()}</span>;
};

export default LunarPhaseIcon;
