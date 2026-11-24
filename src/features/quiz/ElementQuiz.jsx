import { useEffect, useState } from 'react';
import { fetchQuizQuestion } from '../../api/quizApi';

export default function ElementQuiz({ elementKey }) {
  const [question, setQuestion] = useState('');
  const [clues, setClues] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctValue, setCorrectValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setQuestion('');
    setClues([]);
    setOptions([]);
    setCorrectValue(null);
    setSelectedValue(null);
    setSubmitted(false);

    fetchQuizQuestion(controller.signal)
      .then((quizData) => {
        if (controller.signal.aborted) return;
        setQuestion(quizData.question);
        setClues(quizData.clues);
        setOptions(quizData.options);
        setCorrectValue(quizData.correctValue);
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controller.signal.aborted) return;
        setError(err.message || 'Failed to load quiz data.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [elementKey]);

  function handleSubmit(e) {
    e.preventDefault();
    if (selectedValue === null || selectedValue === undefined) return;
    setSubmitted(true);
  }

  if (loading) {
    return (
      <section className="element-quiz" aria-busy="true">
        <h3>Quick Trivia!</h3>
        <p>Loading question...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="element-quiz" role="alert">
        <h3>Quick Trivia!</h3>
        <p>Could not load question: {error}</p>
      </section>
    );
  }

  if (!question) return null;

  const isCorrect = submitted && selectedValue === correctValue;

  return (
    <section className="element-quiz">
      <h3>Quick Trivia!</h3>
      <form onSubmit={handleSubmit}>
        <p>{question}</p>

        {clues.length > 0 && (
          <ul className="quiz-clues">
            {clues.map((clue, index) => (
              <li key={index}>{clue}</li>
            ))}
          </ul>
        )}

        <div className="quiz-options">
          {options.map((option) => (
            <label key={option.id}>
              <input
                type="radio"
                name={`quiz-${elementKey}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => {
                  setSelectedValue(option.value);
                  setSubmitted(false);
                }}
              />
              {option.label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={selectedValue === null || selectedValue === undefined}
        >
          Submit Answer
        </button>
      </form>

      {submitted && (
        <p role="status">
          {isCorrect ? 'Correct!' : 'Wrong, try another option.'}
        </p>
      )}
    </section>
  );
}