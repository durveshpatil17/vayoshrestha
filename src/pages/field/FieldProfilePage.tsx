import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  User,
  Shield,
  Sun,
  Type,
  LogOut,
  MapPin,
  CheckCircle,
  HelpCircle,
  Phone,
} from 'lucide-react';

export const FieldProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_large_text') === 'true';
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('vayoshrestha_field_high_contrast') === 'true';
  });

  const toggleLargeText = () => {
    const next = !isLargeText;
    setIsLargeText(next);
    localStorage.setItem('vayoshrestha_field_large_text', String(next));
    window.location.reload(); // apply layout root styling
  };

  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    localStorage.setItem('vayoshrestha_field_high_contrast', String(next));
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Field Associate Profile
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Your active credentials and display accessibility preferences.
        </p>
      </div>

      {/* Associate Identity Card */}
      <div className="p-4 bg-bg-surface rounded-lg border border-border-hairline space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-semibold text-lg">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="font-semibold text-base text-text-primary">
              {user?.fullName || 'Ramakant Shinde'}
            </div>
            <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>Pune Ekta Hub · Shivajinagar</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-hairline text-xs">
          <div>
            <span className="text-text-muted block text-[11px]">Role Code</span>
            <span className="font-semibold text-accent">SF (Senior Field Associate)</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Phone</span>
            <span className="font-semibold text-text-primary">+91 98220 99001</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Peers Onboarded</span>
            <span className="font-semibold text-text-primary">14 Active Elders</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Training Status</span>
            <span className="font-semibold text-positive flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Certified
            </span>
          </div>
        </div>
      </div>

      {/* Accessibility Controls */}
      <div className="p-4 bg-bg-surface rounded-lg border border-border-hairline space-y-3">
        <h2 className="text-xs font-semibold text-text-secondary">
          Accessibility & Display
        </h2>

        {/* 22px Large Type Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-accent" />
            <div>
              <div className="text-xs font-medium text-text-primary">Large Type (22px)</div>
              <div className="text-[11px] text-text-muted">Enlarged font for easier reading</div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleLargeText}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isLargeText ? 'bg-accent' : 'bg-border-strong'
            }`}
            role="switch"
            aria-checked={isLargeText}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full  transform transition-transform ${
                isLargeText ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-border-hairline">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-accent" />
            <div>
              <div className="text-xs font-medium text-text-primary">High Contrast Mode</div>
              <div className="text-[11px] text-text-muted">High-legibility contrast ratio (≥ 7:1)</div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isHighContrast ? 'bg-accent' : 'bg-border-strong'
            }`}
            role="switch"
            aria-checked={isHighContrast}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full  transform transition-transform ${
                isHighContrast ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Ethical Conduct & Privacy */}
      <div className="p-3 bg-bg-subtle rounded-lg border border-border-hairline space-y-1.5 text-xs text-text-muted">
        <div className="font-semibold text-text-primary flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-accent" />
          Field Privacy Guarantee
        </div>
        <p className="leading-relaxed">
          As a Senior Field Associate, you only access peers you personally onboard. Clinical health logs, full mobile numbers, and SOS emergency cases are strictly hidden to safeguard community elder privacy.
        </p>
      </div>

      {/* Sign Out Button */}
      <Button
        variant="secondary"
        size="lg"
        onClick={handleLogout}
        className="w-full h-12 text-sm font-semibold text-critical hover:bg-critical-tint/30 border border-critical/30 flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of Field Terminal</span>
      </Button>
    </div>
  );
};
