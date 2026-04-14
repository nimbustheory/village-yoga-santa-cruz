import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Zap, Dumbbell, Headphones
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Village Yoga, Santa Cruz
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "VILLAGE",
  subtitle: "YOGA",
  tagline: "Sweat. Smile. Feel great.",
  logoMark: "V",
  description: "Santa Cruz's original hot yoga studio since 2001. Infrared heated classes, a loving community, and 24 years of practice on the mat.",
  heroLine1: "SWEAT",
  heroLine2: "SMILE",

  address: { street: "718 Soquel Ave", city: "Santa Cruz", state: "CA", zip: "95062" },
  phone: "(831) 400-6362",
  email: "info@villageyogasantacruz.com",
  neighborhood: "Midtown, Santa Cruz",
  website: "https://www.villageyogasantacruz.com",
  social: { instagram: "@villageyogasantacruz" },

  theme: {
    accent:     { h: 175, s: 55, l: 42 },   // Warm amber/gold
    accentAlt:  { h: 35, s: 75, l: 55 },    // Soft violet
    warning:    { h: 10, s: 75, l: 55 },     // Burnt orange
    primary:    { h: 200, s: 25, l: 12 },     // Deep midnight blue
    surface:    { h: 40, s: 15, l: 97 },     // Cool white
    surfaceDim: { h: 38, s: 12, l: 93 },     // Soft gray
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
    challenges: true,
    yogaInTheWild: true,
  },

  classCapacity: 35,
  specialtyCapacity: 25,
};
// ═══════════════════════════════════════════════════════════════
//  STUDIO_IMAGES — All image URLs from Village Yoga CDN
// ═══════════════════════════════════════════════════════════════
const STUDIO_IMAGES = {
  logo: "https://static.wixstatic.com/media/045cfa_9e52002fa2134be4bf86484251971574~mv2.png",
  heroYouBelongHere: "https://static.wixstatic.com/media/045cfa_3b630a8c764e41468f4aa06358976aca~mv2.jpg",
  welcomeEntrance: "https://static.wixstatic.com/media/045cfa_fba1eaf17f0b4743b260d1050b05e476~mv2.jpg",
  classesHero: "https://static.wixstatic.com/media/045cfa_bac6f4115ae3464888218f548cf6bde0~mv2.jpg",
  powerBeats: "https://static.wixstatic.com/media/045cfa_f90655736bf648f18bfe5d5b60952044~mv2.jpeg",
  events: "https://static.wixstatic.com/media/045cfa_ac1312fcb5e94d998bb72b0fa00eb9b1~mv2.jpeg",
  about: "https://static.wixstatic.com/media/045cfa_97c6f27aeb70460eb5273c4cef7b4f8e~mv2.jpeg",
  pricing: "https://static.wixstatic.com/media/045cfa_c06d21c2d4ad4c2ea32a0e0e93f2a3be~mv2.jpeg",
  teacherTraining: "https://static.wixstatic.com/media/045cfa_715d6570a11a40c6b469c34ef9d2f34d~mv2.jpeg",
  practiceHero: "https://static.wixstatic.com/media/045cfa_f92c49097e9f4c32a4722e718ea02efa~mv2.jpeg",
  guestPassHero: "https://static.wixstatic.com/media/045cfa_773f30d27f93420dab5cf370c39573fd~mv2.jpg",
  studioExterior: "https://static.wixstatic.com/media/045cfa_552c2af83b2f4126a930cb6349e1ebf5~mv2.jpg",
  teachers: {
    amy: "https://static.wixstatic.com/media/045cfa_fdfc9344604d4e2fac49387742ad73c2~mv2.jpeg",
    sally: "https://static.wixstatic.com/media/045cfa_43284794e0fa41aa9a7cbd1e5da9e183~mv2.jpeg",
    puja: "https://static.wixstatic.com/media/045cfa_ee7b11ee1f584e0ea7baebb941da751f~mv2.jpeg",
    michael: "https://static.wixstatic.com/media/045cfa_ad2e7de1d72b427d826c75278e356078~mv2.jpeg",
    amanda: "https://static.wixstatic.com/media/045cfa_6989aacf83d546c89138fc10a61aa3c7~mv2.jpeg",
    emily: "https://static.wixstatic.com/media/045cfa_e7cded3a3fc9405489a7e440ff3306e8~mv2.jpeg",
    pink: "https://static.wixstatic.com/media/045cfa_6beabf6565814a98bc89c59330064128~mv2.jpg",
    kyle: "https://static.wixstatic.com/media/045cfa_baf7bdc0c7c047678e0c9284fc7342a5~mv2.jpeg",
  },
};


// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#1a1e2e",
  textMuted: "#646880",
  textFaint: "#9a9db0",
  border: "#dfe1ea",
  borderLight: "#ecedf2",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Village Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { photo: STUDIO_IMAGES.teachers.amy, id: "t1", firstName: "Amy", lastName: "Mihal", role: "Co-Founder & Teacher", certs: ["E-RYT 500", "Bikram Certified", "Baptiste Trained"], specialties: ["Hot 26", "Vinyasa Flow", "26 Fusion"], yearsTeaching: 28, bio: "Amy took her first Bikram Yoga class in San Francisco in 1997 and felt so amazing she knew she wanted to practice for the rest of her life. In 2001, she and Sally opened Santa Cruz County's first hot yoga studio. The practice allowed her to get off daily asthma medications she'd taken since childhood." },
  { photo: STUDIO_IMAGES.teachers.sally, id: "t2", firstName: "Sally", lastName: "Adams", role: "Co-Founder & Teacher", certs: ["E-RYT 500", "Bikram Certified", "Modo Certified"], specialties: ["Hot 26", "Vinyasa Flow", "Silent 26"], yearsTeaching: 26, bio: "At 24, after 21 years of dancing, Sally needed a new way of stretching. She found herself in a hot, sweaty yoga class at Global Yoga in San Francisco and never looked back. The 26 postures are like coming home — they make her honest, grateful, and show her how balance takes constant vigilance." },
  { photo: STUDIO_IMAGES.teachers.puja, id: "t3", firstName: "Puja", lastName: "H.", role: "Senior Teacher", certs: ["RYT-500"], specialties: ["Vinyasa Flow", "Hot 26", "HIIT"], yearsTeaching: 12, bio: "Puja delivers a challenging workout while making you laugh. Her energy is infectious, her flows are creative, and she brings something different every single class. Students rave about her across every format." },
  { photo: STUDIO_IMAGES.teachers.michael, id: "t4", firstName: "Michael", lastName: "Branson", role: "Teacher", certs: ["RYT-200"], specialties: ["Hot 26", "Vinyasa Flow"], yearsTeaching: 6, bio: "Michael brings precision and calm to every class. His evening sessions are a favorite for members looking to decompress after a long day in this surf town." },
  { photo: STUDIO_IMAGES.teachers.amanda, id: "t5", firstName: "Amanda", lastName: "Payne", role: "Teacher", certs: ["RYT-200", "Modo Certified"], specialties: ["Hot 26", "Vinyasa Flow", "26 Fusion"], yearsTeaching: 8, bio: "Amanda's yoga journey began at Village Yoga in 2004. From her very first Hot 26 class she was hooked for life. Her background in dance brings a flowing, musical quality to everything she teaches." },
  { photo: STUDIO_IMAGES.teachers.emily, id: "t6", firstName: "Emily", lastName: "Merten", role: "Teacher", certs: ["RYT-200"], specialties: ["Vinyasa Flow", "Yin", "Vin/Yin + Sound"], yearsTeaching: 5, bio: "Emily is a devoted student of yoga and mindfulness. Her teaching style is sincere, intuitive, and lighthearted — she makes yoga accessible to beginners and experienced yogis alike." },
  { photo: STUDIO_IMAGES.teachers.pink, id: "t7", firstName: "Pink", lastName: "Howard", role: "Teacher", certs: ["RYT-200"], specialties: ["Vinyasa Flow", "Hot 26"], yearsTeaching: 4, bio: "Pink's classes are high-energy and full of heart. Her cuing is clear, her playlists are always on point, and she creates a space where everyone feels welcome to sweat and smile." },
  { photo: STUDIO_IMAGES.teachers.kyle, id: "t8", firstName: "Kyle", lastName: "J.", role: "Teacher", certs: ["RYT-200"], specialties: ["Vinyasa Flow", "Kirtan"], yearsTeaching: 3, bio: "Kyle completed his 200-hour training in Mysore, India. He teaches both yoga and music around Santa Cruz, bringing a unique meditative quality and live sound to his classes." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hot 26", type: "HOT26",
  style: "Hot 26", temp: "104°F", duration: 90,
  description: "The original 26 postures and 2 breathing exercises. A beginning series that moves slowly with no upper body weight bearing. Infrared heated to 104°F. The practice that started it all at Village Yoga in 2001.",
  intention: "Sweat. Smile. Feel great. That's why we're here.",
  teacherTip: "Take a second class within 1-2 days. This helps you learn the series, get used to the heat, and maximize benefits. You will feel amazing!",
  playlist: "No music — the dialogue is the soundtrack",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Vinyasa Flow", type: "VINYASA", style: "Flow", temp: "95°F", duration: 60, description: "Fun and different every time — each teacher has their own unique style. Flow from one posture to the next connecting breath with movement. Sun salutations, arm balances, inversions and core work.", intention: "Every flow is a new conversation with your body.", teacherTip: "This isn't the same class twice. Embrace the variety." },
  { id: "p-y2", date: offsetDate(-2), name: "Vin/Yin + Sound", type: "YIN", style: "Vin/Yin", temp: "Room Temp", duration: 75, description: "A slower paced flow with longer holds building strength and peace, finished with healing sound vibrations. The perfect midweek reset.", intention: "Let sound carry you where breath cannot.", teacherTip: "Bring an extra layer for the yin portion. You'll cool down." },
  { id: "p-y3", date: offsetDate(-3), name: "26 Fusion", type: "FUSION", style: "Fusion", temp: "100°F", duration: 60, description: "A set series combining all 26 postures of the original Hot Yoga into a flow with added postures, sun salutations, and core work. Heated with music.", intention: "The best of both worlds — structure meets creativity." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Kirtan Night", type: "SPECIAL", style: "Kirtan", temp: "Room Temp", duration: 90, description: "Come as you are with an open mind and an open heart, and feel the benefits and healing power of Kirtan. Live devotional chanting, community connection, and deep vibrational healing. By donation.", intention: "Open your heart. Let the music move through you.", teacherTip: "No experience needed. Just bring yourself and an open heart. Cash or Venmo for donation." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "Hot 26 (104°F)", coach: "Sally Adams", capacity: 35, registered: 28, waitlist: 0 },
  { id: "cl2", time: "07:30", type: "Vinyasa Flow (95°F)", coach: "Puja H.", capacity: 30, registered: 26, waitlist: 0 },
  { id: "cl3", time: "09:30", type: "Hot 26 (104°F)", coach: "Amy Mihal", capacity: 35, registered: 35, waitlist: 3 },
  { id: "cl4", time: "10:30", type: "Vinyasa Flow (95°F)", coach: "Pink Howard", capacity: 30, registered: 20, waitlist: 0 },
  { id: "cl5", time: "12:00", type: "Hot 26 (104°F)", coach: "Sally Adams", capacity: 35, registered: 24, waitlist: 0 },
  { id: "cl6", time: "16:30", type: "26 Fusion (100°F)", coach: "Amanda Payne", capacity: 35, registered: 30, waitlist: 0 },
  { id: "cl7", time: "18:00", type: "Vin/Yin + Sound", coach: "Emily Merten", capacity: 25, registered: 22, waitlist: 0 },
  { id: "cl8", time: "19:45", type: "Hot 26 (104°F)", coach: "Michael Branson", capacity: 35, registered: 18, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "07:30", type: "Vinyasa Flow (95°F)", coach: "Puja" }, { time: "09:30", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "10:30", type: "Flow (95°F)", coach: "Pink" }, { time: "12:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "16:30", type: "26 Fusion (100°F)", coach: "Amanda" }, { time: "18:00", type: "Vin/Yin + Sound", coach: "Emily" }, { time: "19:45", type: "Hot 26 (104°F)", coach: "Michael" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "08:00", type: "HIIT (95°F)", coach: "Puja" }, { time: "09:30", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "12:00", type: "Vinyasa Flow (95°F)", coach: "Amanda" }, { time: "16:30", type: "Hot 26 (104°F)", coach: "Michael" }, { time: "18:00", type: "Vinyasa Flow (95°F)", coach: "Emily" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "07:30", type: "Vinyasa Flow (95°F)", coach: "Puja" }, { time: "09:30", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "12:00", type: "Slow Flow (95°F)", coach: "Emily" }, { time: "16:30", type: "26 Fusion (100°F)", coach: "Amanda" }, { time: "18:00", type: "Hot 26 (104°F)", coach: "Michael" }] },
  { day: "Thursday", classes: [{ time: "06:00", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "08:00", type: "HIIT (95°F)", coach: "Puja" }, { time: "09:30", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "12:00", type: "Vinyasa Flow (95°F)", coach: "Pink" }, { time: "16:30", type: "Hot 26 (104°F)", coach: "Amanda" }, { time: "18:00", type: "Vin/Yin + Sound", coach: "Emily" }, { time: "19:45", type: "Hot 26 (104°F)", coach: "Michael" }] },
  { day: "Friday", classes: [{ time: "06:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "07:30", type: "Vinyasa Flow (95°F)", coach: "Puja" }, { time: "09:30", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "12:00", type: "Vinyasa Flow (95°F)", coach: "Kyle" }, { time: "16:30", type: "26 Fusion (100°F)", coach: "Amanda" }] },
  { day: "Saturday", classes: [{ time: "08:00", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "09:30", type: "Vinyasa Flow (95°F)", coach: "Puja" }, { time: "11:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "14:00", type: "Yin", coach: "Emily" }] },
  { day: "Sunday", classes: [{ time: "08:00", type: "Hot 26 (104°F)", coach: "Sally" }, { time: "09:30", type: "Vinyasa Flow (95°F)", coach: "Amanda" }, { time: "11:00", type: "Hot 26 (104°F)", coach: "Amy" }, { time: "15:30", type: "Slow Flow (95°F)", coach: "Emily" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Sarah L.", milestone: "500 Classes", message: "After 26 years of practicing yoga at 6 different studios, Village Yoga won my heart five years ago. The peaceful spirit and welcoming energy of this space is sustained by Amy, Sally, and this whole family.", date: today, celebrations: 64 },
  { id: "cf2", user: "David M.", milestone: "30-Day Streak", message: "I took my first Bikram class and started going daily. I feel more flexible, have great stamina, and feel better than ever. Village is home.", date: today, celebrations: 28 },
  { id: "cf3", user: "Luna R.", milestone: "First Hot 26!", message: "I stayed in the room! 104 degrees, 90 minutes, all 26 postures. Amy and Sally's encouragement got me through!", date: offsetDate(-1), celebrations: 52 },
  { id: "cf4", user: "Jake W.", milestone: "1 Year Member", message: "Unlike other studios, I feel a genuine sense of warmth and love from teachers and students alike. I consistently leave smiling — not only from feeling better, but from feeling better loved.", date: offsetDate(-1), celebrations: 48 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Hot 26": { icon: Star, color: "#3b82f6" },
  "Silent 26": { icon: Moon, color: "#8b5cf6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Kirtan Night", date: "2026-04-18", startTime: "19:00", type: "Community Event", description: "Come as you are with an open mind and an open heart. Feel the benefits and healing power of Kirtan with live devotional chanting. By donation ($10-$25 suggested). Cash or Venmo.", fee: 0, maxParticipants: 50, registered: 32, status: "Open" },
  { id: "ev2", name: "Silent Hot 26", date: "2026-05-03", startTime: "09:00", type: "Special Class", description: "A 90-minute Original Hot 26 with no verbal instruction. You lead your own practice. For experienced practitioners who know the series by heart.", fee: 0, maxParticipants: 35, registered: 24, status: "Open" },
  { id: "ev3", name: "Restorative Sunday", date: "2026-04-26", startTime: "16:00", type: "Special Class", description: "A monthly 90-minute deep restorative practice with props, guided meditation, and extended savasana. The perfect way to close your week.", fee: 25, maxParticipants: 25, registered: 18, status: "Registration Open" },
  { id: "ev4", name: "Hot 26 Immersion Weekend", date: "2026-06-07", startTime: "08:00", type: "Workshop", description: "Two days of deep practice with Amy and Sally. History of the 26 postures, alignment clinics, breathing workshops, and community meals. For dedicated practitioners.", fee: 150, maxParticipants: 30, registered: 14, status: "Registration Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "5 Class Pack", type: "pack", price: 110, period: "5 classes", features: ["5 class credits", "Valid for 1 year", "Shareable with partner/family"], popular: false },
  { id: "m2", name: "10 Class Pack", type: "pack", price: 200, period: "10 classes", features: ["10 class credits", "Valid for 1 year", "Shareable with partner/family", "Best casual value"], popular: false },
  { id: "m3", name: "20 Class Pack", type: "pack", price: 340, period: "20 classes", features: ["20 class credits", "Valid for 1 year", "Shareable with partner/family", "Lowest per-class rate"], popular: false },
  { id: "m4", name: "Village Monthly", type: "monthly", price: 150, period: "/month", features: ["Unlimited classes daily", "Online video library access", "No commitment required", "Cancel anytime"], popular: false },
  { id: "m5", name: "Village Deal", type: "unlimited", price: 135, period: "/month", features: ["Unlimited classes daily", "Online video library access", "5% cash discount available", "Locked-in rate guarantee", "3-month minimum"], popular: true },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "New Student Intro: $75 for 30 Days!", message: "Unlimited classes for a full month. Never been to Village? This is your invitation. Santa Cruz County residents only.", type: "celebration", pinned: true },
  { id: "a2", title: "Online Library Now Available", message: "Access our full library of recorded classes — Flow, Hot 26, Pilates, Yin, Restorative, and more. Included with all memberships.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Sarah Lawson", email: "sarah@email.com", membership: "Village Deal", status: "active", joined: "2021-06-01", checkIns: 486, lastVisit: today },
  { id: "mem2", name: "David Marsh", email: "david@email.com", membership: "Village Deal", status: "active", joined: "2022-03-15", checkIns: 372, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Luna Rivera", email: "luna@email.com", membership: "Village Monthly", status: "active", joined: "2025-09-01", checkIns: 48, lastVisit: offsetDate(-2) },
  { id: "mem4", name: "Jake Wilson", email: "jake@email.com", membership: "Village Deal", status: "active", joined: "2025-03-24", checkIns: 144, lastVisit: today },
  { id: "mem5", name: "Mia Chen", email: "mia@email.com", membership: "Village Deal", status: "frozen", joined: "2024-01-01", checkIns: 128, lastVisit: offsetDate(-30) },
  { id: "mem6", name: "Kai Nakamura", email: "kai@email.com", membership: "10 Class Pack", status: "active", joined: "2026-01-05", checkIns: 7, lastVisit: offsetDate(-4) },
  { id: "mem7", name: "Bella Torres", email: "bella@email.com", membership: "Village Deal", status: "active", joined: "2023-05-01", checkIns: 268, lastVisit: today },
  { id: "mem8", name: "Owen Park", email: "owen@email.com", membership: "5 Class Pack", status: "active", joined: "2025-12-15", checkIns: 3, lastVisit: offsetDate(-6) },
];

const ADMIN_METRICS = {
  activeMembers: 198, memberChange: 12,
  todayCheckIns: 88, weekCheckIns: 496,
  monthlyRevenue: 26700, revenueChange: 7.8,
  workshopRevenue: 2400,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 88, avg: 11 }, { day: "Tue", total: 72, avg: 12 },
    { day: "Wed", total: 80, avg: 13 }, { day: "Thu", total: 84, avg: 12 },
    { day: "Fri", total: 68, avg: 14 }, { day: "Sat", total: 56, avg: 14 },
    { day: "Sun", total: 52, avg: 13 },
  ],
  revenue: [
    { month: "Sep", revenue: 22400 }, { month: "Oct", revenue: 23600 },
    { month: "Nov", revenue: 24200 }, { month: "Dec", revenue: 23100 },
    { month: "Jan", revenue: 25400 }, { month: "Feb", revenue: 26000 },
    { month: "Mar", revenue: 26700 },
  ],
  classPopularity: [
    { name: "6:00 AM", pct: 80 }, { name: "7:30 AM", pct: 88 },
    { name: "9:30 AM", pct: 100 }, { name: "10:30 AM", pct: 68 },
    { name: "12:00 PM", pct: 70 }, { name: "4:30 PM", pct: 86 },
    { name: "6:00 PM", pct: 88 }, { name: "7:45 PM", pct: 52 },
  ],
  membershipBreakdown: [
    { name: "Village Deal", value: 88, color: T.accent },
    { name: "Village Monthly", value: 42, color: T.success },
    { name: "20 Class Pack", value: 22, color: T.warning },
    { name: "10 Class Pack", value: 28, color: T.textMuted },
    { name: "5 Class Pack", value: 18, color: "#94a3b8" },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", color: "#fff", padding: "32px 22px", minHeight: 240 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.heroYouBelongHere})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "absolute", top: 16, right: 20, fontSize: 80, opacity: 0.06, lineHeight: 1, zIndex: 1 }}>{STUDIO_CONFIG.logoMark}</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 52, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#a8b0c0", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#5a5e70", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#5a5e70", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image={STUDIO_IMAGES.classesHero} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Schedule" subtitle="Reserve your spot — classes fill up fast" image={STUDIO_IMAGES.powerBeats} />
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Sound") || cls.type.includes("Restorative") || cls.type.includes("Somatic");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => {
    setSaved("log");
    setTimeout(() => setSaved(null), 2000);
    setReflection({ energy: 4, focus: 4, notes: "" });
  };

  const streakDays = 16;
  const totalClasses = 104;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image={STUDIO_IMAGES.practiceHero} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: T.text }}>8</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "100 Classes", "7-Day Streak", "30-Day Streak", "First Inversion", "1 Year Member"].includes(name);
            const BadgeIcon = badge.icon;
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? badge.color + "30" : T.border}`, borderRadius: 14, opacity: earned ? 1 : 0.45 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: earned ? `${badge.color}15` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BadgeIcon size={24} color={earned ? badge.color : T.textFaint} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, textAlign: "center" }}>{name}</span>
                {earned && <CircleCheck size={14} color={badge.color} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Community" subtitle="Celebrate each other's wins at Village" image={STUDIO_IMAGES.about} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#484c5e", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Teachers" subtitle="Meet the Village teaching team" image={STUDIO_IMAGES.teacherTraining} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.firstName} loading="lazy" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                ) : null}
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: teacher.photo ? "none" : "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Membership" subtitle="Find your practice — packs or monthly" image={STUDIO_IMAGES.pricing} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Best Value
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              {tier.name === "Village Deal" ? <Flame size={20} color={T.warning} /> : tier.name === "Village Monthly" ? <Star size={20} color={T.accent} /> : tier.name.includes("Class Pack") ? <Gift size={20} color={T.success} /> : <Moon size={20} color={T.textMuted} />}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: 0, color: T.text }}>{tier.name}</h3>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#4a4e60" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Events" subtitle="Kirtan, Silent 26, and special offerings" image={STUDIO_IMAGES.events} />
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(222,25%,14%))`, padding: "20px 18px", color: "#fff" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#a8b0c0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={ev.fee === 0 ? "Free" : `$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              {ev.status === "Active Now" ? "View Challenge" : "Register Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  GUEST PASS PAGE
// ═══════════════════════════════════════════════════════════════
function GuestPassPage() {
  const [sent, setSent] = useState(false);
  const passesRemaining = 2;
  const passesUsed = 1;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Guest Passes" subtitle="Bring a friend to Village" image={STUDIO_IMAGES.guestPassHero} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
          <Gift size={20} color={T.accent} style={{ margin: "0 auto 6px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: T.text }}>{passesRemaining}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase" }}>Available</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
          <UserPlus size={20} color={T.success} style={{ margin: "0 auto 6px" }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: T.text }}>{passesUsed}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase" }}>Shared</div>
        </div>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, margin: "0 0 14px" }}>Send a Guest Pass</h3>
        <InputField label="Friend's Name" placeholder="Their name" />
        <InputField label="Their Email" placeholder="friend@email.com" />
        <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 2500); }} style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: 17, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {sent ? <><Check size={16} /> Sent!</> : <><Send size={16} /> Send Pass</>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+18 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: "#1f2937", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#6b7280" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Popularity (% Capacity)">
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.classPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={11} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937" }} formatter={v => [`${v}%`, "Fill Rate"]} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {ADMIN_CHARTS.classPopularity.map((entry, i) => (
                    <Cell key={i} fill={entry.pct >= 90 ? T.warning : entry.pct >= 70 ? T.accent : T.success} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.membership.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Members</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <Search size={16} color="#6b7280" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ background: "transparent", border: "none", color: "#1f2937", fontSize: 13, outline: "none", width: 140 }} />
        </div>
      </div>
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Member", "Plan", "Status", "Check-ins", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>{m.name.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <p style={{ color: "#1f2937", fontWeight: 600, margin: 0 }}>{m.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 11, margin: "1px 0 0" }}>{m.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#4b5563" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning, textTransform: "capitalize" }}>{m.status}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#6b7280", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px", color: "#1f2937", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#4b5563", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#4b5563" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#e5e7eb", color: "#6b7280" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#4b5563", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#4b5563", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#6b7280" }}>{formatDateShort(ev.date)} · {ev.type} · {ev.fee === 0 ? "Free" : `$${ev.fee}`}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#6b7280" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Pricing & Memberships</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#ffffff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>BEST VALUE</span>}
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1f2937", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 14, color: "#6b7280", fontWeight: 400 }}> {tier.period}</span></div>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>{tier.features.length} features</p>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#4b5563", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1f2937", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "members", "class passes", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#e5e7eb", color: audience === a ? "#fff" : "#6b7280" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSettingsPage() {
  const [studioName, setStudioName] = useState(STUDIO_CONFIG.name + " " + STUDIO_CONFIG.subtitle);
  const [studioEmail, setStudioEmail] = useState(STUDIO_CONFIG.email);
  const [studioPhone, setStudioPhone] = useState(STUDIO_CONFIG.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1f2937", margin: 0 }}>Settings</h1>

      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1f2937", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Studio Information</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Studio Name</label>
            <input value={studioName} onChange={e => setStudioName(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
            <input value={studioEmail} onChange={e => setStudioEmail(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label>
            <input value={studioPhone} onChange={e => setStudioPhone(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</label>
            <input value={`${STUDIO_CONFIG.address.street}, ${STUDIO_CONFIG.address.city}, ${STUDIO_CONFIG.address.state} ${STUDIO_CONFIG.address.zip}`} readOnly style={{ width: "100%", padding: "10px 14px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, color: "#6b7280", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1f2937", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Booking Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#1f2937" }}>Default Class Capacity</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{STUDIO_CONFIG.classCapacity}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#1f2937" }}>Specialty Class Capacity</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{STUDIO_CONFIG.specialtyCapacity}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#1f2937" }}>Allow Waitlist</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: `${T.accent}20`, color: T.accent }}>Enabled</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#1f2937" }}>Cancellation Window</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>2 hours</span>
          </div>
        </div>
      </div>

      <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1f2937", fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Features</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(STUDIO_CONFIG.features).map(([key, val]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <span style={{ fontSize: 14, color: "#1f2937", textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: val ? `${T.accent}20` : "#f3f4f6", color: val ? T.accent : "#6b7280" }}>{val ? "On" : "Off"}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {saved ? <><Check size={16} /> Saved</> : "Save Settings"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}


function PageHero({ title, subtitle, image }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "28px 20px 20px", minHeight: 220, marginBottom: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: `linear-gradient(135deg, ${T.bg}, ${T.accentDark})` }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 34, margin: 0, color: "#fff" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}
function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isExpanded = expanded !== undefined ? expanded : isFeatured;

  const typeColors = {
    POWER: T.accent, CANDLELIT: T.success, YIN: "#8b5cf6", HEATED: T.success, SPECIAL: T.success,
  };

  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {practice.date === today ? (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span>
            ) : (
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}12`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isFeatured ? 26 : 20, margin: 0, color: T.text }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Flame size={14} color={T.warning} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.warning }}>{practice.temp}</span>
            </div>
          )}
          <p style={{ fontSize: 14, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && (
            <div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span>
              <p style={{ fontSize: 13, color: "#4a4e60", margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p>
            </div>
          )}
          {practice.teacherTip && (
            <div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher's Note</span>
              <p style={{ fontSize: 13, color: "#4a4e60", margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.text }}>{value}</div>
      <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "28px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={28} color={T.textFaint} />
      <p style={{ fontWeight: 600, color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 12, color: T.textFaint, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", background: T.bgDim, boxSizing: "border-box", marginTop: 4 };
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ borderRadius: 14, padding: "22px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.welcomeEntrance})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))" }} />
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, opacity: 0.08, lineHeight: 1, zIndex: 1 }}>{STUDIO_CONFIG.logoMark}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600, position: "relative", zIndex: 2 }}>New Student Special</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", margin: "0 0 14px", maxWidth: 260, position: "relative", zIndex: 2 }}>30 days of unlimited classes for just $75. First time at Village? Santa Cruz County residents — this is your invitation.</p>
      <button onClick={() => setPage("membership")} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em", position: "relative", zIndex: 2 }}>
        Get Started
      </button>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
      <h3 style={{ color: "#1f2937", fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>AP</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Ashley Park</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Village Deal Member · Since Mar 2023</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Challenges", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Midtown, Santa Cruz · Santa Cruz's Original Hot Yoga Since 2001</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", title: "Class Reminder", message: "Hot 26 with Amy starts in 1 hour", time: "55 min ago", read: false },
    { id: "n2", title: "Streak Update", message: "You're on a 16-day streak! Keep showing up on the mat.", time: "2 hrs ago", read: false },
    { id: "n3", title: "Community", message: "Sarah L. just reached 500 classes! Celebrate with her.", time: "4 hrs ago", read: true },
    { id: "n4", title: "New Class Added", message: "Slow Flow is now on the schedule -- Mondays & Fridays at noon", time: "Yesterday", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        {notifications.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.borderLight}` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : T.accent, marginTop: 6, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, color: T.text, margin: 0 }}>{n.title}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: "2px 0 0" }}>{n.message}</p>
              <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);

  const totalReg = classData.registered + (classData.waitlist || 0);
  const isFull = totalReg >= classData.capacity;
  const spotsLeft = classData.capacity - classData.registered;
  const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(classData.id);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px" }}>
        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, margin: 0, color: T.text }}>Confirm Reservation</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button>
            </div>
            <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarDays size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: isFull ? T.warning : spotsLeft <= 5 ? T.success : T.text }}>
                    {isFull ? `Full — you'll be added to the waitlist` : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>Village Yoga · Midtown</span>
                </div>
              </div>
            </div>
            <button onClick={handleConfirm} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", background: isFull ? T.warning : T.accent, color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: "0.03em" }}>
              {isFull ? "Join Waitlist" : "Confirm Reservation"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={32} color={T.accent} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: "0 0 6px", color: T.text }}>You're In!</h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>
              {classData.type} · {fmtTime(classData.time)}<br/>See you on the mat!
            </p>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [reservationClass, setReservationClass] = useState(null);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const [showAdminToggle] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const handleOpenAdmin = () => { setIsAdmin(true); setPage("admin-dashboard"); };
    window.addEventListener("openAdmin", handleOpenAdmin);
    return () => window.removeEventListener("openAdmin", handleOpenAdmin);
  }, []);

  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 }));
  }, []);

  const openReservation = useCallback((cls) => {
    setReservationClass(cls);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 }));
  }, []);

  const handleLogoClick = () => {
    if (isAdmin) { setIsAdmin(false); }
    setPage("home");
  };

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: Flame },
    { id: "community", label: "Community", icon: Heart },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "classes", label: "Classes", icon: CalendarDays },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: Star },
    { id: "guest-passes", label: "Guest Passes", icon: Gift },
  ];

  const isMoreActive = moreItems.some(m => m.id === page);

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: DollarSign },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "guest-passes": return <GuestPassPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f3f4f6", color: "#1f2937" }}>
          <aside style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", zIndex: 20 }}>
            <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>{STUDIO_CONFIG.logoMark}</div>
                <div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#1f2937", fontWeight: 600, display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span>
                  <span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Panel</span>
                </div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#6b7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", height: "100%", position: "relative", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Scrollable content area */}
        <div ref={contentRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 64, overflowY: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {/* Header */}
          <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>{STUDIO_CONFIG.logoMark}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
                <span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
              </div>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {showAdminToggle && (
                <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
                  <Shield size={20} />
                </button>
              )}
              <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
                <Bell size={20} />
                {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
              </button>
              <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
                <Settings size={20} />
              </button>
            </div>
          </header>

          {/* Content */}
          <main>
            {renderPage()}
          </main>
        </div>

        {/* Bottom Navigation */}
        <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 64, background: "#fff", borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 }}>
          {mainTabs.map(tab => {
            const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
            if (tab.id === "more") {
              return (
                <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            }
            return (
              <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 72, left: 16, right: 16, background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
