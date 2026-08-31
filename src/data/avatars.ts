import { AvatarOption } from '../types';

export const AVATARS: AvatarOption[] = [
  {
    id: 'wolf',
    nameAr: 'الذئب الشيكور',
    nameEn: 'Cyber Wolf',
    svgIcon: '🐺',
    bgGradient: 'from-rose-600 to-red-900',
  },
  {
    id: 'fox',
    nameAr: 'الثعلب الماكر',
    nameEn: 'Sly Fox',
    svgIcon: '🦊',
    bgGradient: 'from-amber-500 to-orange-800',
  },
  {
    id: 'fennec',
    nameAr: 'الفنك الصحراوي',
    nameEn: 'Desert Fennec',
    svgIcon: '🏜️',
    bgGradient: 'from-yellow-500 to-amber-700',
  },
  {
    id: 'detective',
    nameAr: 'المحقق كونان',
    nameEn: 'Detective',
    svgIcon: '🕵️‍♂️',
    bgGradient: 'from-cyan-600 to-blue-900',
  },
  {
    id: 'ninja',
    nameAr: 'النينجا المتخفي',
    nameEn: 'Shadow Ninja',
    svgIcon: '🥷',
    bgGradient: 'from-slate-700 to-slate-950',
  },
  {
    id: 'lion',
    nameAr: 'أسد الأطلس',
    nameEn: 'Atlas Lion',
    svgIcon: '🦁',
    bgGradient: 'from-amber-600 to-yellow-900',
  },
  {
    id: 'alien',
    nameAr: 'الفضائي الغامض',
    nameEn: 'Cosmic Alien',
    svgIcon: '👽',
    bgGradient: 'from-emerald-500 to-teal-900',
  },
  {
    id: 'king',
    nameAr: 'السلطان',
    nameEn: 'The King',
    svgIcon: '👑',
    bgGradient: 'from-purple-600 to-indigo-950',
  },
  {
    id: 'skull',
    nameAr: 'القرصان',
    nameEn: 'Pirate Ghost',
    svgIcon: '🏴‍☠️',
    bgGradient: 'from-zinc-600 to-zinc-900',
  },
  {
    id: 'robot',
    nameAr: 'الروبوت الذكي',
    nameEn: 'Cyber Bot',
    svgIcon: '🤖',
    bgGradient: 'from-sky-500 to-blue-800',
  },
  {
    id: 'clown',
    nameAr: 'البهلوان الساخر',
    nameEn: 'Joker',
    svgIcon: '🎭',
    bgGradient: 'from-pink-600 to-rose-900',
  },
  {
    id: 'wizard',
    nameAr: 'الساحر العجيب',
    nameEn: 'Sorcerer',
    svgIcon: '🧙‍♂️',
    bgGradient: 'from-violet-600 to-purple-950',
  },
];

export function getRandomAvatarId(): string {
  const idx = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[idx].id;
}

export function getAvatarById(id: string): AvatarOption {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}
