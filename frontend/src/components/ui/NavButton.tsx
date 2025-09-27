import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@utils/index';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = React.memo(function NavButton({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'pill transition-colors',
        active 
          ? 'text-white bg-white/10 ring-1 ring-white/10' 
          : 'text-slate-200/90 hover:bg-white/5'
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
});

export default NavButton;
