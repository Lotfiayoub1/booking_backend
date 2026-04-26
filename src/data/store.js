'use strict';

let _uid = 4;
let _sid = 5;
let _bid = 2;

const nextId = (counter) => {
  if (counter === 'u') return String(_uid++);
  if (counter === 's') return String(_sid++);
  return String(_bid++);
};

const users = [
  { id: '1', name: 'Super Admin',   email: 'superadmin@booking.com', password: 'Admin@123',   role: 'super_admin', banned: false, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '2', name: 'Admin User',    email: 'admin@booking.com',      password: 'Admin@123',   role: 'admin',       banned: false, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '3', name: 'Alice Student', email: 'alice@booking.com',      password: 'Student@1',   role: 'student',     banned: false, createdAt: '2026-01-15T00:00:00.000Z' },
];

const sessions = [
  { id: '1', subject: 'Math',    title: 'Algebra Basics',   description: 'Intro to linear equations', date: '2026-05-10T09:00:00.000Z', duration: 60, totalSlots: 5, availableSlots: 4, createdBy: '2', status: 'active',    createdAt: '2026-04-01T00:00:00.000Z' },
  { id: '2', subject: 'Physics', title: "Newton's Laws",    description: 'Mechanics and forces',      date: '2026-05-12T14:00:00.000Z', duration: 90, totalSlots: 3, availableSlots: 3, createdBy: '2', status: 'active',    createdAt: '2026-04-01T00:00:00.000Z' },
  { id: '3', subject: 'Math',    title: 'Calculus Intro',   description: 'Limits and derivatives',    date: '2026-05-15T10:00:00.000Z', duration: 60, totalSlots: 8, availableSlots: 8, createdBy: '2', status: 'active',    createdAt: '2026-04-02T00:00:00.000Z' },
  { id: '4', subject: 'Physics', title: 'Electromagnetism', description: 'Fields and waves',          date: '2026-05-18T11:00:00.000Z', duration: 90, totalSlots: 6, availableSlots: 6, createdBy: '2', status: 'active',    createdAt: '2026-04-03T00:00:00.000Z' },
];

const bookings = [
  { id: '1', studentId: '3', sessionId: '1', status: 'booked', createdAt: '2026-04-10T00:00:00.000Z' },
];

module.exports = {
  users,
  sessions,
  bookings,
  nextId,
};
