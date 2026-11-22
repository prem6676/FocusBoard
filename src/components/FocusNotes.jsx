import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './FocusNotes.css';

const SLIDES = [
  {
    id: 'focus',
    heading: 'Start with your most important task',
    text: 'Pick one high-priority task and give it your full attention first. Momentum on what matters beats progress on everything at once.',
  },
  {
    id: 'breaks',
    heading: 'Work in focused sprints',
    text: 'Short, timed sessions with real breaks keep your mind sharp. Try 25 minutes of deep work followed by a 5-minute reset.',
  },
  {
    id: 'review',
    heading: 'Close the day with a quick review',
    text: 'Two minutes at the end of the day to update statuses and plan tomorrow makes your next morning dramatically smoother.',
  },
];

export default function FocusNotes() {
  const [activeIndex, setActiveIndex] = useState(0);

  const previousSlide = () => {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  };

  const slide = SLIDES[activeIndex];

  return (
    <section className="focus-notes" aria-label="Focus notes">
      <p className="focus-notes__eyebrow">
        <Sparkles size={14} aria-hidden="true" />
        Focus notes
      </p>

      <div className="focus-notes__slide" aria-live="polite">
        <h2 className="focus-notes__heading">{slide.heading}</h2>
        <p className="focus-notes__text">{slide.text}</p>
      </div>

      <div className="focus-notes__controls">
        <div className="focus-notes__indicators" role="tablist" aria-label="Focus note slides">
          {SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1} of ${SLIDES.length}`}
              className={`focus-notes__indicator${
                index === activeIndex ? ' focus-notes__indicator--active' : ''
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <div className="focus-notes__arrows">
          <button
            type="button"
            className="focus-notes__arrow"
            onClick={previousSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="focus-notes__arrow"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
