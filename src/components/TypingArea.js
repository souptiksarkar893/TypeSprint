import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TypingArea = () => {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [typedWords, setTypedWords] = useState([]);
  const [completedWords, setCompletedWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [errorWords, setErrorWords] = useState([]);
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(60);

  const timerOptions = [30, 60, 120];
  const wordsContainerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      fetchWords();
    }
  }, [isActive]);

  const fetchWords = async (count = 1000) => {
    try {
      const response = await axios.get(`https://random-word-api.herokuapp.com/word?number=${count}`);
      setWords(response.data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInput(value);

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const currentWord = words[typedWords.length];

      // Check if the typed word matches the current word
      if (typedWord === currentWord) {
        setCorrectWords(correctWords + 1);
        setErrorWords((prev) => prev.filter((word, i) => i !== typedWords.length));
      } else {
        if (!errorWords.includes(typedWord)) {
          setErrorWords((prev) => [...prev, typedWord]);
        }
      }

      setTypedWords((prev) => [...prev, typedWord]);
      setCompletedWords(completedWords + 1);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && input === '') {
      if (typedWords.length > 0) {
        const lastTypedWord = typedWords.pop();
        setTypedWords([...typedWords]);
        setInput(lastTypedWord);
      }
    }
  };

  const startTest = () => {
    setIsActive(true);
    setTimer(selectedTimer);
    setCompletedWords(0);
    setCorrectWords(0);
    setTypedWords([]);
    setErrorWords([]);
    setInput('');
    setIsFinished(false);
    fetchWords();
    if (wordsContainerRef.current) {
      wordsContainerRef.current.scrollTop = 0;
    }
  };

  const restartTest = () => {
    startTest();
  };

  useEffect(() => {
    if (isActive && timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsActive(false);
      setIsFinished(true);
    }
  }, [isActive, timer]);

  const calculateWPM = () => {
    return (completedWords / (selectedTimer - timer)) * 60;
  };

  const calculateAccuracy = () => {
    return completedWords === 0 ? 0 : Math.round((correctWords / completedWords) * 100);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Typing Test</h2>
      <div className="row">
        {/* Left Column: Phrase Text Area */}
        <div className="col-md-8">
          <div
            ref={wordsContainerRef}
            className="words-display border rounded p-4 mb-4 overflow-auto"
            style={{ maxHeight: '300px', height: '100%', minHeight: '300px' }}
          >
            {words.map((word, index) => {
              let className = '';
              if (index < typedWords.length) {
                if (typedWords[index] === word) {
                  className = 'text-success';
                } else if (errorWords.includes(typedWords[index])) {
                  className = 'text-danger';
                }
              }
              return (
                <span key={index} className={className}>
                  {word}{' '}
                </span>
              );
            })}
          </div>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="form-control mb-3"
            disabled={!isActive}
            placeholder="Start typing..."
          />
        </div>

        {/* Right Column: Timer, Stats, Controls */}
        <div className="col-md-4">
          {!isActive && !isFinished && (
            <div className="mb-3">
              <h5>Select Timer:</h5>
              <div className="d-flex justify-content-center">
                {timerOptions.map((option) => (
                  <div className="form-check mx-2" key={option}>
                    <input
                      type="radio"
                      id={`timer-${option}`}
                      name="timer"
                      className="form-check-input"
                      value={option}
                      checked={selectedTimer === option}
                      onChange={() => setSelectedTimer(option)}
                    />
                    <label htmlFor={`timer-${option}`} className="form-check-label">
                      {option} seconds
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isActive && <div className="timer mb-3">Time left: {timer}s</div>}
          {isFinished && <h5 className="text-danger">Timer Up!</h5>}

          {(isActive || isFinished) && (
            <div className="stats">
              <p>Words Per Minute (WPM): {calculateWPM()}</p>
              <p>Accuracy: {calculateAccuracy()}%</p>
            </div>
          )}

          {!isActive && !isFinished && (
            <button className="btn btn-primary w-100 mb-3" onClick={startTest}>
              Start Test
            </button>
          )}
          {isActive && (
            <button className="btn btn-secondary w-100 mb-3" onClick={restartTest}>
              Restart Test
            </button>
          )}
          {isFinished && (
            <div>
              <h5>Test Finished! Choose Timer and Start Again</h5>
              <div className="mb-3">
                <h5>Select Timer:</h5>
                <div className="d-flex justify-content-center">
                  {timerOptions.map((option) => (
                    <div className="form-check mx-2" key={option}>
                      <input
                        type="radio"
                        id={`timer-${option}`}
                        name="timer"
                        className="form-check-input"
                        value={option}
                        checked={selectedTimer === option}
                        onChange={() => setSelectedTimer(option)}
                      />
                      <label htmlFor={`timer-${option}`} className="form-check-label">
                        {option} seconds
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary w-100" onClick={restartTest}>
                Restart Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingArea;
