/**
 * MONSTEROUS RADIO — TOP HITS CHART
 * Sample chart data (taken from the client's supplied design reference).
 * Edit this list weekly — it powers the "Top Hits" sidebar on the homepage.
 */
export interface TopHit {
  rank: number;
  title: string;
  artist: string;
  /** Gradient colors for the generated thumbnail */
  from: string;
  to: string;
}

export const topHits: TopHit[] = [
  { rank: 1, title: "No Excuses", artist: "Meghan Trainor", from: "#ed37bd", to: "#53107a" },
  { rank: 2, title: "All of Me", artist: "John Legend", from: "#b6e51d", to: "#1a2604" },
  { rank: 3, title: "Sorry", artist: "Justin Bieber", from: "#8e3ec9", to: "#1d0629" },
  { rank: 4, title: "Psycho", artist: "Post Malone", from: "#f3c744", to: "#7a4a03" },
  { rank: 5, title: "Shape of My Heart", artist: "Backstreet Boys", from: "#53107a", to: "#050407" },
];
