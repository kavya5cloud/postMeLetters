
import React from 'react';

export const StarDoodle = ({ className = "" }) => (
  <svg className={`${className} doodle-float`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9L22 9L16 13L18.5 20L12 16L5.5 20L8 13L2 9L9.5 9L12 2Z" stroke="#F69D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartDoodle = ({ className = "" }) => (
  <svg className={`${className} doodle-float`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="#F69D8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SwirlDoodle = ({ className = "" }) => (
  <svg className={`${className} doodle-float`} width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10C2 10 10 2 20 10C30 18 38 10 38 10" stroke="#333940" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round"/>
  </svg>
);

export const LeafDoodle = ({ className = "" }) => (
  <svg className={`${className} animate-wiggle-gentle`} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 25V15M15 15C15 15 15 5 25 5M15 15C15 15 15 5 5 5M15 15C15 15 5 15 5 25M15 15C15 15 25 15 25 25" stroke="#333940" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
