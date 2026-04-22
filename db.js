/**
 * db.js — Simple JSON file database
 * Replaces MongoDB. Data is stored in db.json in the same folder.
 */

const fs   = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, 'db.json');

// ── Read / Write ─────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const empty = { users: [], buses: [], stops: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── ID generator ─────────────────────────────────────────────────────────────
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Users ─────────────────────────────────────────────────────────────────────
function getUsers()       { return readDB().users; }

function getUserBy(field, value) {
  return readDB().users.find(u => u[field] === value) || null;
}

function createUser(data) {
  const db   = readDB();
  const user = { ...data, _id: newId(), id: newId() };
  db.users.push(user);
  writeDB(db);
  return user;
}

function updateUser(id, updates) {
  const db  = readDB();
  const idx = db.users.findIndex(u => u._id === id || u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...updates };
  writeDB(db);
  return db.users[idx];
}

function deleteUser(id) {
  const db  = readDB();
  const idx = db.users.findIndex(u => u._id === id || u.id === id);
  if (idx === -1) return false;
  db.users.splice(idx, 1);
  writeDB(db);
  return true;
}

// ── Buses ─────────────────────────────────────────────────────────────────────
function getBuses()       { return readDB().buses; }

function createBus(data) {
  const db  = readDB();
  const bus = { ...data, _id: newId() };
  db.buses.push(bus);
  writeDB(db);
  return bus;
}

// ── Stops ─────────────────────────────────────────────────────────────────────
function getStops()       { return readDB().stops.sort((a, b) => a.id - b.id); }

function createStop(data) {
  const db     = readDB();
  const lastId = db.stops.length ? Math.max(...db.stops.map(s => s.id)) : 0;
  const stop   = { ...data, id: lastId + 1, _id: newId() };
  db.stops.push(stop);
  writeDB(db);
  return stop;
}

function updateStop(numericId, updates) {
  const db  = readDB();
  const idx = db.stops.findIndex(s => s.id === numericId);
  if (idx === -1) return null;
  db.stops[idx] = { ...db.stops[idx], ...updates };
  writeDB(db);
  return db.stops[idx];
}

function deleteStop(numericId) {
  const db  = readDB();
  const idx = db.stops.findIndex(s => s.id === numericId);
  if (idx === -1) return false;
  db.stops.splice(idx, 1);
  writeDB(db);
  return true;
}

module.exports = {
  getUsers, getUserBy, createUser, updateUser, deleteUser,
  getBuses, createBus,
  getStops, createStop, updateStop, deleteStop,
};
