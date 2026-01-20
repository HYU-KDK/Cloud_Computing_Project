const API_BASE_URL = "http://localhost:8000/api";

/* ------------------------
   Profile / Onboarding
------------------------- */

export async function saveProfile(data) {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
}

/* ------------------------
   Recommendations
------------------------- */

export async function fetchRecommendations(context = "coldstart") {
  const res = await fetch(
    `${API_BASE_URL}/recommendations?context=${context}`
  );

  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

/* ------------------------
   Summary / Quiz
------------------------- */

export async function generateSummary(paperId) {
  const res = await fetch(
    `${API_BASE_URL}/papers/${paperId}/summaries`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to generate summary");
  return res.json();
}

export async function generateQuiz(paperId) {
  const res = await fetch(
    `${API_BASE_URL}/papers/${paperId}/quizzes`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to generate quiz");
  return res.json();
}

/* ------------------------
   Quiz Attempt
------------------------- */

export async function submitQuizAttempt({
  quizId,
  userId,
  paperId,
  answers,
}) {
  const res = await fetch(
    `${API_BASE_URL}/papers/quizzes/${quizId}/attempts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        paper_id: paperId,
        answers,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to submit quiz");
  return res.json();
}

/* ------------------------
   Growth
------------------------- */

export async function fetchGrowth() {
  const res = await fetch(`${API_BASE_URL}/growth`);
  if (!res.ok) throw new Error("Failed to fetch growth");
  return res.json();
}
