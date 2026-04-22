/**
 * seed.js — Tạo dữ liệu mẫu vào db.json (không cần MongoDB)
 * Chạy: node seed.js
 */

const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'db.json');

async function hash(pw) { return bcrypt.hash(pw, 10); }
function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

async function seed() {
  console.log('🌱 Bắt đầu tạo dữ liệu...');

  // ── Buses ──────────────────────────────────────────────────────────────────
  const buses = [
    { _id: newId(), id: 1, plate: '64B-111.11', capacity: 40, route: 'Tuyến A' },
    { _id: newId(), id: 2, plate: '64B-222.22', capacity: 35, route: 'Tuyến B' },
    { _id: newId(), id: 3, plate: '64B-333.33', capacity: 30, route: 'Tuyến C' },
  ];

  // ── Stops ──────────────────────────────────────────────────────────────────
  const stops = [
    { _id: newId(), id: 1, name: 'Trạm 1',      lat: 10.2530, lng: 105.9720, eta: '06:10', actual: '06:11', status: 'passed', busId: '1' },
    { _id: newId(), id: 2, name: 'Trạm 2',     lat: 10.2570, lng: 105.9760, eta: '06:18', actual: '06:20', status: 'passed', busId: '1' },
    { _id: newId(), id: 3, name: 'Trạm 3',         lat: 10.2610, lng: 105.9790, eta: '06:25', actual: '--:--', status: 'next',   busId: '1' },
    { _id: newId(), id: 4, name: 'Trạm 4', lat: 10.2650, lng: 105.9820, eta: '06:33', actual: '--:--', status: 'pending', busId: '1' },
    { _id: newId(), id: 5, name: 'Trường',          lat: 10.2700, lng: 105.9870, eta: '06:45', actual: '--:--', status: 'pending', busId: '1' },
  ];

  // ── Users ──────────────────────────────────────────────────────────────────
  const usersRaw = [
    { username: 'admin', password: '1', name: 'Quản trị viên',        role: 'admin' },
    { username: 'tx01',  password: '1', name: 'Tài xế 1',  role: 'driver' },
    { username: 'tx02',  password: '1', name: 'Tài xế 2', role: 'driver' },
    { username: 'tx03',  password: '1', name: 'Tài xế 3', role: 'driver' },
    { username: 'ph11T1_35',  password: '1', name: 'Phụ huynh Phan Nguyễn Phương Uyên', role: 'parent' },
    { username: 'ph11A2',  password: '1', name: 'Phụ huynh Phan Nguyên Thảo',    role: 'parent' },
    { username: 'ph11LT',  password: '1', name: 'Phụ huynh Nguyễn Phạm Lan Anh',    role: 'parent' },
    { username: 'ph11T1_04',  password: '1', name: 'Phụ huynh Trịnh Hồng Ân',    role: 'parent' },
    // Bus 1
    { username: '11T1_35', password: '1', name: 'Phan Nguyễn Phương Uyên',  role: 'student', class: '11T1', busId: '1', startStopId: 1, isBoarded: false },
    { username: '11LT', password: '1', name: 'Nguyễn Phạm Lan Anh',     role: 'student', class: '11LT', busId: '1', startStopId: 2, isBoarded: false },
    // bus 2
    { username: '11A2', password: '1', name: 'Phan Nguyên Thảo',   role: 'student', class: '11A2', busId: '2', startStopId: 1, isBoarded: false},
   
    // Bus 3
    { username: '11T1_04', password: '1', name: 'Trịnh Hồng Ân',  role: 'student', class: '11L1', busId: '3', startStopId: 2, isBoarded: false },
  ];

  const users = [];
  for (const raw of usersRaw) {
    const id = newId();
    users.push({
      ...raw,
      _id: id,
      id:  id,
      username: raw.username.toLowerCase(),
      password: await hash(raw.password),
    });
  }

  const db = { buses, stops, users };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  console.log(`🚌 Seeded ${buses.length} buses`);
  console.log(`📍 Seeded ${stops.length} stops`);
  console.log(`👤 Seeded ${users.length} users`);
  console.log('\n🎉 Xong! Dữ liệu lưu tại db.json');
  console.log('\nTài khoản đăng nhập:');
  console.log('   admin / 1   → Admin');
  console.log('   tx01  / 1   → Tài xế');
  console.log('   hs01  / 1   → Học sinh');
  console.log('   ph01  / 1   → Phụ huynh');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
