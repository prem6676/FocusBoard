import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import './FocusNotes.css';

const SLIDES = [
  {
    id: 'today',
    heading: 'Make today count.',
    text: 'A little focus goes a long way.',
    task: 'Design landing page',
    progress: '75%',
    label: 'TODAY’S FOCUS',
  },
  {
    id: 'progress',
    heading: 'Small steps, big progress.',
    text: 'Keep your priorities in view.',
    task: 'Review project updates',
    progress: '60%',
    label: 'KEEP GOING',
  },
  {
    id: 'wins',
    heading: 'Celebrate the wins.',
    text: 'Every completed task moves you forward.',
    task: 'Weekly goals completed',
    progress: '100%',
    label: 'YOU DID IT',
  },
];

export default function FocusNotes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SLIDES[activeIndex];
  const previousSlide = () => setActiveIndex((current) => (current + SLIDES.length - 1) % SLIDES.length);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % SLIDES.length);

  return (
    <section className="focus-notes" aria-label="Focus notes carousel">
      <div className="focus-notes__copy" aria-live="polite">
        <div className="focus-notes__eyebrow"><Sparkles size={12} /> FOCUS NOTES <span>{String(activeIndex + 1).padStart(2, '0')} / 03</span></div>
        <h2 className="focus-notes__heading">{slide.heading}</h2>
        <p className="focus-notes__text">{slide.text}</p>
      </div>
      <div className="focus-notes__preview" aria-hidden="true">
        <div className="focus-notes__preview-check"><Check size={11} /></div>
        <div className="focus-notes__preview-content">
          <span>{slide.label}</span>
          <strong>{slide.task}</strong>
          <div className="focus-notes__progress"><i style={{ width: slide.progress }} /></div>
          <small>{slide.progress}</small>
        </div>
      </div>
      <div className="focus-notes__controls">
        <div className="focus-notes__indicators" role="tablist" aria-label="Choose focus note">
          {SLIDES.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`} className={`focus-notes__indicator${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(index)} />
          ))}
        </div>
        <div className="focus-notes__arrows">
          <button type="button" className="focus-notes__arrow" onClick={previousSlide} aria-label="Previous focus note"><ChevronLeft size={15} /></button>
          <button type="button" className="focus-notes__arrow" onClick={nextSlide} aria-label="Next focus note"><ChevronRight size={15} /></button>
        </div>
      </div>
    </section>
  );
}
