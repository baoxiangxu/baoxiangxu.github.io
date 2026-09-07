import Profile from '../content/profile.json';

const names = Profile.name.split(' ');

export const FirstName = names[0];
export const LastName = names[names.length - 1];
export const Initials = FirstName.charAt(0).toUpperCase() + LastName.charAt(0).toUpperCase();
