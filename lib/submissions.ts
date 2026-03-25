export type Submission = {
  id: string;
  trailName: string;
  activity: string[];
  region: string;
  difficulty: "green" | "blue" | "black" | "expert";
  description: string;
  videoLink: string;
  gpxData: {
    coordinates: { lat: number; lng: number; ele: number }[];
    distance_km: number;
    elevation_gain_m: number;
  } | null;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
};

const STORAGE_KEY = "tv_submissions";

export function getSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(submission: Submission): void {
  const existing = getSubmissions();
  existing.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function updateSubmissionStatus(id: string, status: Submission["status"]): void {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx !== -1) {
    submissions[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
}
