interface ProgressLineProps {
  completed: number;
  total: number;
}

const ProgressLine = ({ completed, total }: ProgressLineProps) => {
  const width = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="progress-block">
      <div className="progress-copy">
        <span>Progress / ਤਰੱਕੀ</span>
        <strong>{completed} / {total}</strong>
      </div>
      <div className="progress-line" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
};

export default ProgressLine;