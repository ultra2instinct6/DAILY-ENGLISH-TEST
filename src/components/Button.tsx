import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaChecked?: boolean;
  role?: string;
  title?: string;
}

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
  ariaPressed,
  ariaChecked,
  role,
  title,
}: ButtonProps) => {
  return (
    <button
      className={`button button-${variant} ${fullWidth ? 'button-full' : ''}`.trim()}
      disabled={disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-checked={ariaChecked}
      role={role}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;