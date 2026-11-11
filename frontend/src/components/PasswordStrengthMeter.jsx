import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Calculates password strength based on entropy and common password policies:
 * 1. Minimum 8 characters
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one lowercase letter (a-z)
 * 4. At least one number (0-9)
 * 5. At least one special symbol (!@#$%^&*...)
 */
export function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'None',
      rules: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      },
    };
  }

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(rules).filter(Boolean).length;

  let score = 0;
  let label = 'Very Weak';

  if (passedCount <= 1) {
    score = 1;
    label = 'Weak';
  } else if (passedCount === 2 || passedCount === 3) {
    score = 2;
    label = 'Fair';
  } else if (passedCount === 4) {
    score = 3;
    label = 'Good';
  } else if (passedCount === 5) {
    score = 4;
    label = 'Strong';
  }

  return { score, label, rules };
}

export default function PasswordStrengthMeter({ password }) {
  const { score, label, rules } = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  if (!password) return null;

  return (
    <div className="password-strength-container" aria-live="polite">
      <div className="strength-meter-bar">
        <div className={`strength-meter-fill strength-${score}`} />
      </div>

      <div className="strength-label-row">
        <span>Password strength:</span>
        <span className={`strength-score-text strength-${score}`}>{label}</span>
      </div>

      <div className="strength-rules-list">
        <div className={`rule-item ${rules.length ? 'valid' : ''}`}>
          {rules.length ? <Check size={12} /> : <X size={12} />}
          <span>Min 8 characters</span>
        </div>
        <div className={`rule-item ${rules.uppercase ? 'valid' : ''}`}>
          {rules.uppercase ? <Check size={12} /> : <X size={12} />}
          <span>Uppercase letter</span>
        </div>
        <div className={`rule-item ${rules.number ? 'valid' : ''}`}>
          {rules.number ? <Check size={12} /> : <X size={12} />}
          <span>At least one number</span>
        </div>
        <div className={`rule-item ${rules.special ? 'valid' : ''}`}>
          {rules.special ? <Check size={12} /> : <X size={12} />}
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
}
