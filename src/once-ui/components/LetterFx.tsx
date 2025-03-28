"use client";

import React, { useState, useRef, useCallback, useEffect, forwardRef, ReactNode } from "react";
import classNames from "classnames";

const defaultCharset = ["X", "$", "@", "a", "H", "z", "o", "0", "y", "#", "?", "*", "0", "1", "+"];

function getRandomCharacter(charset: string[]): string {
  const randomIndex = Math.floor(Math.random() * charset.length);
  return charset[randomIndex];
}

const speedSettings = {
  fast: {
    BASE_DELAY: 10,
    REVEAL_DELAY: 10,
    INITIAL_RANDOM_DURATION: 100,
  },
  medium: {
    BASE_DELAY: 30,
    REVEAL_DELAY: 30,
    INITIAL_RANDOM_DURATION: 300,
  },
  slow: {
    BASE_DELAY: 60,
    REVEAL_DELAY: 60,
    INITIAL_RANDOM_DURATION: 600,
  },
};

type LetterFxProps = {
  children: ReactNode;
  trigger?: "hover" | "instant" | "custom";
  speed?: "fast" | "medium" | "slow";
  charset?: string[];
  onTrigger?: (triggerFn: () => void) => void;
  className?: string;
  style?: React.CSSProperties;
};

const LetterFx = forwardRef<HTMLSpanElement, LetterFxProps>(
  (
    {
      children,
      trigger = "hover",
      speed = "medium",
      charset = defaultCharset,
      onTrigger,
      className,
      style,
    },
    ref,
  ) => {
    const [text, setText] = useState<string>(typeof children === "string" ? children : "");
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [hasAnimated, setHasAnimated] = useState<boolean>(false);
    const originalText = useRef<string>(typeof children === "string" ? children : "");

    const eventHandler = useCallback(async () => {
      if (inProgress) return;
      setInProgress(true);

      const { BASE_DELAY, REVEAL_DELAY, INITIAL_RANDOM_DURATION } = speedSettings[speed];

      const generateRandomText = () =>
        originalText.current
          .split("")
          .map((char) => (char === " " ? " " : getRandomCharacter(charset)))
          .join("");

      let randomizedText = generateRandomText();
      const endTime = Date.now() + INITIAL_RANDOM_DURATION;

      while (Date.now() < endTime) {
        setText(randomizedText);
        await new Promise((resolve) => setTimeout(resolve, BASE_DELAY));
        randomizedText = generateRandomText();
      }

      for (let i = 0; i < originalText.current.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, REVEAL_DELAY));
        setText(`${originalText.current.substring(0, i + 1)}${randomizedText.substring(i + 1)}`);
      }

      setInProgress(false);
      if (trigger === "instant" && setHasAnimated) {
        setHasAnimated(true);
      }
    }, [inProgress, trigger, speed, charset, setText, setInProgress, setHasAnimated]);

    useEffect(() => {
      if (typeof children === "string") {
        setText(children);
        originalText.current = children;
        if (trigger === "instant" && !hasAnimated) {
          eventHandler();
        }
      }
    }, [children, trigger, eventHandler, hasAnimated]);

    useEffect(() => {
      if (trigger === "custom" && onTrigger) {
        onTrigger(eventHandler);
      }
    }, [trigger, onTrigger, eventHandler]);

    return (
      <span
        ref={ref}
        className={classNames(className)}
        style={style}
        onMouseOver={trigger === "hover" ? eventHandler : undefined}
      >
        {text}
      </span>
    );
  },
);

LetterFx.displayName = "LetterFx";

export { LetterFx };
