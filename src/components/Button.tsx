import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      className={`button button-${variant} ${fullWidth ? 'button-full' : ''}`.trim()}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;