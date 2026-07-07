const API_URL = "http://127.0.0.1:8000";

export interface DashboardStats {
  active_guardians: number;
  cats_saved: number;
  mission_success: number;
  ai_status: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}