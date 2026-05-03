interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  progressText?: string;
}

const AppHeader = ({ title, subtitle, showBack = false, onBack, progressText }: AppHeaderProps) => {
  const shouldShowBack = showBack || Boolean(onBack);

  return (
    <header className="app-header">
      <div>
        {shouldShowBack && onBack ? (
          <button aria-label="Go back" className="ghost-button header-back" onClick={onBack} type="button">
            Back
          </button>
        ) : null}
        <p className="eyebrow">Daily English Practice</p>
        {title ? <h1 className="title">{title}</h1> : null}
        {subtitle ? <p className="header-subtitle">{subtitle}</p> : null}
        {progressText ? <p className="muted">{progressText}</p> : null}
      </div>
    </header>
  );
};

export default AppHeader;