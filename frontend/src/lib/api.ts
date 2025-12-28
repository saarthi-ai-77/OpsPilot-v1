const SUBMIT_WEBHOOK_URL = import.meta.env.VITE_N8N_SUBMIT_WEBHOOK;
const GET_SUMMARY_WEBHOOK_URL = import.meta.env.VITE_N8N_GET_SUMMARY_WEBHOOK;

export interface DailyUpdatePayload {
  member_id: string;
  team_id: string;
  work_done: string;
  blockers?: string;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface SummaryResponse {
  success: boolean;
  summary: string;
}

export interface TeamSummary {
  teamName: string;
  date: string;
  avgConfidence: 'Low' | 'Medium' | 'High';
  totalUpdates: number;
  summary: string;
}

export async function submitUpdate(data: DailyUpdatePayload): Promise<{ success: boolean; message?: string }> {
  if (!SUBMIT_WEBHOOK_URL) {
    throw new Error('VITE_N8N_SUBMIT_WEBHOOK is not configured');
  }

  try {
    const response = await fetch(SUBMIT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to submit update. You might have already submitted today.'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting update:', error);
    return { success: false, message: 'Network error. Please try again later.' };
  }
}

export async function getSummary(teamId: string, date: string): Promise<SummaryResponse> {
  if (!GET_SUMMARY_WEBHOOK_URL) {
    throw new Error('VITE_N8N_GET_SUMMARY_WEBHOOK is not configured');
  }

  try {
    const response = await fetch(`${GET_SUMMARY_WEBHOOK_URL}?team_id=${teamId}&date=${date}`);

    if (!response.ok) {
      return { success: false, summary: '' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { success: false, summary: '' };
  }
}
