import { Comment, Content, Position } from "react-pdf-highlighter";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      category: {
        Row: {
          color: string;
          description: string | null;
          documentcount: number;
          id: string;
          name: string;
          user_id: string | null;
        };
        Insert: {
          color: string;
          description?: string | null;
          documentcount?: number;
          id?: string;
          name: string;
          user_id?: string | null;
        };
        Update: {
          color?: string;
          description?: string | null;
          documentcount?: number;
          id?: string;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          parts: Json | null;
          role: string | null;
          session_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          parts?: Json | null;
          role?: string | null;
          session_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          parts?: Json | null;
          role?: string | null;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "chat_sessions";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_sessions: {
        Row: {
          created_at: string | null;
          id: string;
          paper_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          paper_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          paper_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_sessions_paper_id_fkey";
            columns: ["paper_id"];
            isOneToOne: false;
            referencedRelation: "research_papers";
            referencedColumns: ["id"];
          }
        ];
      };
      highlights: {
        Row: {
          comment: Comment | null;
          content: Content;
          created_at: string | null;
          id: string;
          paper_id: string;
          position: Position;
          updated_at: string | null;
        };
        Insert: {
          comment: Comment | null;
          content: Content;
          paper_id: string;
          position: Position;
          updated_at?: string | null;
          created_at?: string | null;
          id?: string;
        };
        Update: {
          comment: Comment | null;
          content: Content;
          paper_id: string;
          position: Position;
          updated_at?: string | null;
          created_at?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_research_paper";
            columns: ["paper_id"];
            isOneToOne: false;
            referencedRelation: "research_papers";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          paper_id: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          paper_id: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          paper_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_paper_id_fkey";
            columns: ["paper_id"];
            isOneToOne: false;
            referencedRelation: "research_papers";
            referencedColumns: ["id"];
          }
        ];
      };
      research_papers: {
        Row: {
          abstract: string;
          authors: string[] | null;
          category_id: string | null;
          content: string | null;
          created_at: string | null;
          disclosures: Json | null;
          doi: string | null;
          embedding: string | null;
          id: string;
          is_deleted: boolean | null;
          keywords: string[] | null;
          paper_references: Json | null;
          pdf_path: string;
          publication: string | null;
          title: string;
          user_id: string | null;
        };
        Insert: {
          abstract: string;
          authors?: string[] | null;
          category_id?: string | null;
          content?: string | null;
          created_at?: string | null;
          disclosures?: Json | null;
          doi?: string | null;
          embedding?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          keywords?: string[] | null;
          paper_references?: Json | null;
          pdf_path: string;
          publication?: string | null;
          title: string;
          user_id?: string | null;
        };
        Update: {
          abstract?: string;
          authors?: string[] | null;
          category_id?: string | null;
          content?: string | null;
          created_at?: string | null;
          disclosures?: Json | null;
          doi?: string | null;
          embedding?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          keywords?: string[] | null;
          paper_references?: Json | null;
          pdf_path?: string;
          publication?: string | null;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "research_papers_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_research_papers: {
        Args:
          | {
              query_embedding: string;
              match_threshold: number;
              match_count: number;
            }
          | {
              query_embedding: string;
              match_threshold: number;
              match_count: number;
              paper_id: string;
            };
        Returns: {
          id: string;
          content: string;
          similarity: number;
        }[];
      };
      update_document_count: {
        Args: { category_id: number; action: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

export type ResearchPapers = Tables<"research_papers">;
export type Categories = Tables<"category">;
export type ResearchPapersInsert = Tables<"research_papers">;
export interface ResearchPaperMetadata {
  title: string;
  abstract: string;
  authors: { name: string; affiliation?: string }[];
  keywords?: string[];
  doi: string;
  publication?: {
    journal?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    publicationDate: string;
  };
  core?: {
    codeRepository?: string;
    dataRepository?: string;
  };
  references?: {
    title: string;
    authors: string[];
    journal?: string;
    year: number;
    doi?: string;
  }[];
  disclosures?: {
    fundingSources?: string[];
    conflictsOfInterest?: string[];
  };
}
