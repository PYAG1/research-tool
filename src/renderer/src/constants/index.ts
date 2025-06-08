import { createGoogleGenerativeAI } from '@ai-sdk/google';
export const queryKey={
    categories: "categories",
    category: "category",
    papers:"research_papers",
    paper:"research_paper",
    highlights: "highlights",
    notes: "notes",
}


export const google = createGoogleGenerativeAI({
 apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});


export const STORAGE_KEYS = {
  PINNED_CATEGORIES: "rst_pinned_categories",
};