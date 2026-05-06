import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityProps } from './types';
import Button from '../Button';

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickRound = (
  pool: any[],
  size: number,
  preferUnusedIds: Set<string>,
): any[] => {
  if (pool.length <= size) return shuffle(pool);
  const unused = pool.filter((p) => !preferUnusedIds.has(p.id));
  if (unused.length >= size) return shuffle(unused).slice(0, size);
  // not enough unused — take all unused + random from used
  const used = pool.filter((p) => preferUnusedIds.has(p.id));
  return shuffle([...unused, ...shuffle(used).slice(0, size - unused.length)]);
};

const VocabMatchActivity = ({ question, response, updateResponse }: ActivityProps) => {
  const pool = question.vocabPairs ?? [];
  const roundSize = Math.min(question.vocabRoundSize ?? 6, pool.length);

  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [roundPairs, setRoundPairs] = useState<any[]>(() => {
    const initial = pickRound(pool, roundSize, new Set());
    return initial;
  });
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [wrongMeaningId, setWrongMeaningId] = useState<string | null>(null);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const wrongFlashRef = useRef<number | null>(null);

  const shuffledMeanings = useMemo(() => shuffle(roundPairs), [roundPairs]);

  useEffect(() => {
    return () => {
      if (wrongFlashRef.current) window.clearTimeout(wrongFlashRef.current);
    };
  }, []);

  const matchedCount = Object.keys(matched).length;
  const total = roundPairs.length;
  const isComplete = total > 0 && matchedCount === total;

  useEffect(() => {
    const completedRounds = roundsCompleted + (isComplete ? 1 : 0);
    const summary = isComplete
      ? `Completed ${completedRounds} round${completedRounds === 1 ? '' : 's'} (${total} words each)`
      : `Matching round ${roundsCompleted + 1}: ${matchedCount}/${total}`;
    updateResponse({ studentAnswer: summary });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCount, total, isComplete, roundsCompleted]);

  const handleMeaningClick = (meaningId: string) => {
    if (!activeTermId) return;
    if (activeTermId === meaningId) {
      setMatched({ ...matched, [activeTermId]: meaningId });
      setActiveTermId(null);
    } else {
      setWrongMeaningId(meaningId);
      if (wrongFlashRef.current) window.clearTimeout(wrongFlashRef.current);
      wrongFlashRef.current = window.setTimeout(() => setWrongMeaningId(null), 400);
      setActiveTermId(null);
    }
  };

  const playAgain = () => {
    const nextSeen = new Set(seenIds);
    roundPairs.forEach((p) => nextSeen.add(p.id));
    // if everything seen, reset cycle
    const seenForPick = nextSeen.size >= pool.length ? new Set<string>() : nextSeen;
    const next = pickRound(pool, roundSize, seenForPick);
    setSeenIds(seenForPick.size === 0 ? new Set(next.map((p) => p.id)) : nextSeen);
    setRoundPairs(next);
    setMatched({});
    setActiveTermId(null);
    setWrongMeaningId(null);
    setRoundsCompleted((n) => n + 1);
  };

  return (
    <div className="stack-gap-md">
      <p className="muted no-margin">
        Tap a word, then tap its meaning. / ਸ਼ਬਦ ’ਤੇ ਟੈਪ ਕਰੋ, ਫਿਰ ਉਸਦਾ ਮਤਲਬ ਚੁਣੋ।
      </p>
      <p style={{ margin: 0, fontWeight: 600 }}>
        Round {roundsCompleted + 1} · Matched {matchedCount} / {total}
        {pool.length > roundSize ? (
          <span className="muted small" style={{ marginLeft: 8, fontWeight: 400 }}>
            (from a bank of {pool.length} words)
          </span>
        ) : null}
      </p>

      <div className="matching-grid">
        <div className="matching-column">
          <p className="label">Words</p>
          {roundPairs.map((pair) => {
            const isMatched = Boolean(matched[pair.id]);
            const isActive = activeTermId === pair.id;
            return (
              <Button
                key={pair.id}
                fullWidth
                variant={isActive || isMatched ? 'primary' : 'secondary'}
                disabled={isMatched}
                onClick={() => setActiveTermId(pair.id)}
              >
                {pair.term} {isMatched ? '✅' : ''}
              </Button>
            );
          })}
        </div>
        <div className="matching-column">
          <p className="label">Meanings</p>
          {shuffledMeanings.map((pair) => {
            const isUsed = Object.values(matched).includes(pair.id);
            const isWrong = wrongMeaningId === pair.id;
            return (
              <Button
                key={pair.id}
                fullWidth
                variant={isWrong ? 'primary' : 'secondary'}
                disabled={isUsed || !activeTermId}
                onClick={() => handleMeaningClick(pair.id)}
              >
                <span style={{ display: 'block', textAlign: 'left' }}>
                  {pair.definitionEn}
                  {pair.definitionPa ? (
                    <>
                      <br />
                      <span className="punjabi muted">{pair.definitionPa}</span>
                    </>
                  ) : null}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {isComplete ? (
        <div className="card vocab-round-complete">
          <p style={{ margin: 0, fontWeight: 700 }}>
            🎉 All {total} matched! / ਸਾਰੇ ਮਿਲਾ ਲਏ!
          </p>
          <p className="muted small" style={{ margin: '4px 0 10px' }}>
            Play again with new words from the bank, or tap <strong>Next</strong> below to continue.
            <br />
            <span className="punjabi">ਨਵੇਂ ਸ਼ਬਦਾਂ ਨਾਲ ਫਿਰ ਖੇਡੋ, ਜਾਂ ਹੇਠਾਂ Next ਦਬਾ ਕੇ ਅੱਗੇ ਜਾਓ।</span>
          </p>
          <Button onClick={playAgain} variant="primary">
            🔁 Play again with new words
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default VocabMatchActivity;

