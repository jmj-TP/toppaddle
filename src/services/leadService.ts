import { toast } from "sonner";

export interface LeadData {
    name: string;
    email: string;
    equipmentType: 'pre' | 'custom' | 'main';
    equipmentDetails: any;
    timestamp: string;
}

/**
 * LeadService handles submission of captured leads.
 * Currently implemented as a mock that logs to console and shows success.
 * In production, this would connect to Supabase, Firestore, or a custom API.
 */
export const leadService = {
    submitLead: async (lead: LeadData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lead),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit lead');
            }

            return { success: true };
        } catch (error) {
            console.error('Lead submission error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
    },

    // Legacy mock methods no longer needed but kept for type safety if used elsewhere
    getLeads: (): LeadData[] => {
        return [];
    },

    clearLeads: () => {
        // No-op
    }
};
