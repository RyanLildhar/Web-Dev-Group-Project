const QUIZ_API_URL = 'https://api.periodictableofelements.org/elements/quiz/';

function apiQuizToAppQuiz(raw) {
  const options = Array.isArray(raw.choices)
    ? raw.choices.map((choice, index) => {
        const value = choice.value ?? choice.atomic_number ?? index;
        const label = choice.label ?? choice.name ?? String(value);
        return { id: `${value}-${index}`, value, label };
      })
    : [];

  return {
    type: raw.type ?? 'general',
    question: raw.question,
    clues: Array.isArray(raw.clues) ? raw.clues : [],
    options,
    correctValue: raw.answer,
  };
}

export function fetchQuizQuestion(signal) {
  return fetch(QUIZ_API_URL, { signal }).then(async (res) => {
    if (!res.ok) {
      throw new Error(`Quiz request failed with status ${res.status}`);
    }
    const rawData = await res.json();
    return apiQuizToAppQuiz(rawData);
  });
}