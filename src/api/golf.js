import axios from 'axios';
import config from '../assets/config.json';

const HEADERS = {
  'X-RapidAPI-Key': '6df9d41375msh7ea88695de29f7bp1ad8a6jsnf5f951f3046f',
  'X-RapidAPI-Host': 'live-golf-data.p.rapidapi.com',
};
const BASE_URL = 'https://live-golf-data.p.rapidapi.com';
const DEFAULT_TOURN_ID = '014';
const API_YEAR = config.events.fantasy.api_year;

export async function getCurrentTournId() {
  try {
    const { data } = await axios.get(`${BASE_URL}/schedule`, {
      params: { orgId: '1', year: API_YEAR },
      headers: HEADERS,
    });
    const schedule = data?.schedule ?? [];
    const today = new Date();
    const toDate = (dateString) => (dateString ? new Date(dateString) : null);

    const inProgress = schedule.find((tournament) => {
      const start = toDate(tournament.date?.start);
      const end = toDate(tournament.date?.end);
      return start && end && today >= start && today <= end;
    });
    if (inProgress) return inProgress.tournId || DEFAULT_TOURN_ID;

    const upcoming = schedule
      .filter((tournament) => toDate(tournament.date?.start) > today)
      .sort((a, b) => toDate(a.date.start) - toDate(b.date.start));
    if (upcoming.length) return upcoming[0].tournId || DEFAULT_TOURN_ID;

    const past = schedule
      .filter((tournament) => toDate(tournament.date?.end) < today)
      .sort((a, b) => toDate(b.date.end) - toDate(a.date.end));
    if (past.length) return past[0].tournId || DEFAULT_TOURN_ID;
  } catch { /* ignore */ }
  return DEFAULT_TOURN_ID;
}

export async function fetchLeaderboard(tournId) {
  const fetchFor = async (id) => {
    const { data } = await axios.get(`${BASE_URL}/leaderboard`, {
      params: { orgId: '1', tournId: id, year: API_YEAR },
      headers: HEADERS,
    });
    return {
      rows: data?.leaderboardRows ?? [],
      currentRound: data?.currentRound ?? null,
      roundStatus: data?.roundStatus ?? null,
      lastUpdated: data?.lastUpdated ?? null,
    };
  };

  try {
    return await fetchFor(tournId);
  } catch (err) {
    if (err?.response?.status === 400 && tournId !== DEFAULT_TOURN_ID) {
      return await fetchFor(DEFAULT_TOURN_ID);
    }
    throw err;
  }
}

export async function fetchTournament(tournId) {
  const { data } = await axios.get(`${BASE_URL}/tournament`, {
    params: { orgId: '1', tournId, year: API_YEAR },
    headers: HEADERS,
  });
  return data ?? {};
}

/**
 * Returns true when round 4 is finished.
 * Uses roundStatus "Official" when available; falls back to checking
 * whether ≥70% of players show thru="F".
 */
export function isTournamentComplete(rows, currentRound, roundStatus) {
  if (roundStatus && roundStatus.toLowerCase() === 'official') return true;
  if (currentRound !== null && currentRound !== 4) return false;
  if (!rows.length) return false;
  const finishedCount = rows.filter((row) => row.thru === 'F').length;
  return finishedCount / rows.length >= 0.7;
}

/** Parse an API score string ("E", "+3", "-2", 0) into a number. Returns null if unknown. */
export function parseScore(val) {
  if (val === null || val === undefined || val === '') return null;
  if (val === 'E') return 0;
  const parsed = parseInt(String(val).replace('+', ''), 10);
  return isNaN(parsed) ? null : parsed;
}

/** Format a numeric score back to golf convention: 0 → "E", 3 → "+3", -2 → "-2", null → "--" */
export function formatScore(val) {
  if (val === null || val === undefined) return '--';
  if (val === 0) return 'E';
  if (val > 0) return `+${val}`;
  return String(val);
}

/** Return the CSS class for a numeric golf score. */
export function scoreClass(val) {
  if (val === null || val === undefined) return 'golf-score even-par';
  if (val < 0) return 'golf-score under-par';
  if (val > 0) return 'golf-score over-par';
  return 'golf-score even-par';
}
