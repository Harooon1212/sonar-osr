export const EASE_OUT = [0.22, 1, 0.36, 1];

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.14 } },
};

export const cardStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

export const cardItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } },
};

export const dropdownMotion = {
  initial: { opacity: 0, scale: 0.98, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.16, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12 } },
};
