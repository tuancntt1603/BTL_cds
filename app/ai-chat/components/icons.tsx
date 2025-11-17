import React from 'react';
import { Send as LucideSend, User as LucideUser, Sparkles as LucideSparkles } from 'lucide-react';

type SvgProps = React.SVGProps<SVGSVGElement> & { className?: string };

export const Send: React.FC<SvgProps> = (props) => <LucideSend {...props} />;
export const UserIcon: React.FC<SvgProps> = (props) => <LucideUser {...props} />;
export const Sparkles: React.FC<SvgProps> = (props) => <LucideSparkles {...props} />;

export const Bot: React.FC<SvgProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="7" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8.5" cy="12" r="1" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1" fill="currentColor" />
    <rect x="9" y="3" width="6" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default null;
