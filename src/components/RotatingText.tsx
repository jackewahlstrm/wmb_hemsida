'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface RotatingTextProps {
  texts: string[];
  transition?: object;
  initial?: object;
  animate?: object;
  exit?: object;
  animatePresenceMode?: 'wait' | 'sync' | 'popLayout';
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'characters' | 'words' | 'lines' | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>((props, ref) => {
  const {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text: string) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('sv', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        return Math.abs(Math.floor(Math.random() * totalChars) - index) * staggerDuration;
      }
      return Math.abs((staggerFrom as number) - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [next, rotationInterval, auto]);

  const longestText = texts.reduce((a, b) => (a.length >= b.length ? a : b), '');

  return (
    <motion.span
      className={cn('inline-block relative', mainClassName)}
      {...(rest as object)}
      transition={transition as never}
    >
      {/* Ghost — expands container to longest text width, never clipped */}
      <span className="invisible pointer-events-none select-none whitespace-nowrap block" aria-hidden="true">
        {longestText}
      </span>
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span key={currentTextIndex} className="absolute inset-0 inline-flex items-center justify-center" aria-hidden="true">
          {elements.map((wordObj, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, w) => sum + w.characters.length, 0);
            const totalChars = array.reduce((sum, w) => sum + w.characters.length, 0);
            return (
              <span key={wordIndex} className={cn('inline-flex', splitLevelClassName)}>
                {wordObj.characters.map((char, charIndex) => (
                  <span key={charIndex} className="inline-block overflow-hidden">
                    <motion.span
                      initial={initial as never}
                      animate={animate as never}
                      exit={exit as never}
                      transition={
                        {
                          ...(transition as object),
                          delay: getStaggerDelay(previousCharsCount + charIndex, totalChars),
                        } as never
                      }
                      className={cn('inline-block', elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
                {wordObj.needsSpace && <span className="inline-block">&nbsp;</span>}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
      </div>
    </motion.span>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;
