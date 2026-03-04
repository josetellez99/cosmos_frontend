export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          created_at: string | null
          description: string | null
          goal_id: number | null
          id: number
          modified_at: string | null
          name: string
          target_amount: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          goal_id?: number | null
          id?: never
          modified_at?: string | null
          name: string
          target_amount: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          goal_id?: number | null
          id?: never
          modified_at?: string | null
          name?: string
          target_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "actions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: true
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      actions_records: {
        Row: {
          action_id: number
          counting_units: number
          created_at: string | null
          habit_id: number | null
          id: number
          modified_at: string | null
          subgoal_id: number | null
        }
        Insert: {
          action_id: number
          counting_units: number
          created_at?: string | null
          habit_id?: number | null
          id?: never
          modified_at?: string | null
          subgoal_id?: number | null
        }
        Update: {
          action_id?: number
          counting_units?: number
          created_at?: string | null
          habit_id?: number | null
          id?: never
          modified_at?: string | null
          subgoal_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_records_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_records_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_records_subgoal_id_fkey"
            columns: ["subgoal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      actions_rules: {
        Row: {
          action_id: number
          created_at: string | null
          habit_id: number | null
          id: number
          item_adding_counting: number
          subgoal_id: number | null
        }
        Insert: {
          action_id: number
          created_at?: string | null
          habit_id?: number | null
          id?: never
          item_adding_counting: number
          subgoal_id?: number | null
        }
        Update: {
          action_id?: number
          created_at?: string | null
          habit_id?: number | null
          id?: never
          item_adding_counting?: number
          subgoal_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_rules_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_rules_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_rules_subgoal_id_fkey"
            columns: ["subgoal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          color: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          is_subgoal: boolean
          modified_at: string | null
          name: string
          sort_order: number
          starting_date: string
          status: Database["public"]["Enums"]["item_status_type"] | null
          temporality:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          is_subgoal: boolean
          modified_at?: string | null
          name: string
          sort_order: number
          starting_date: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          is_subgoal?: boolean
          modified_at?: string | null
          name?: string
          sort_order?: number
          starting_date?: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goals_subitems: {
        Row: {
          created_at: string | null
          goal_id: number
          habit_id: number | null
          id: number
          project_id: number | null
          subgoal_id: number | null
          subitem_order: number
          subitem_type: Database["public"]["Enums"]["item_type"]
          subitem_weight: number
          system_id: number | null
        }
        Insert: {
          created_at?: string | null
          goal_id: number
          habit_id?: number | null
          id?: never
          project_id?: number | null
          subgoal_id?: number | null
          subitem_order: number
          subitem_type: Database["public"]["Enums"]["item_type"]
          subitem_weight: number
          system_id?: number | null
        }
        Update: {
          created_at?: string | null
          goal_id?: number
          habit_id?: number | null
          id?: never
          project_id?: number | null
          subgoal_id?: number | null
          subitem_order?: number
          subitem_type?: Database["public"]["Enums"]["item_type"]
          subitem_weight?: number
          system_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_subitems_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_subitems_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_subitems_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_subitems_subgoal_id_fkey"
            columns: ["subgoal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_subitems_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string | null
          description: string | null
          emoji: string
          id: number
          modified_at: string | null
          name: string
          schedule_config: Json
          schedule_type: Database["public"]["Enums"]["habit_scheduling_type"]
          starting_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emoji: string
          id?: never
          modified_at?: string | null
          name: string
          schedule_config: Json
          schedule_type: Database["public"]["Enums"]["habit_scheduling_type"]
          starting_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emoji?: string
          id?: never
          modified_at?: string | null
          name?: string
          schedule_config?: Json
          schedule_type?: Database["public"]["Enums"]["habit_scheduling_type"]
          starting_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      habits_records: {
        Row: {
          created_at: string | null
          habit_id: number
          id: number
          is_completed: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          habit_id: number
          id?: never
          is_completed: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          habit_id?: number
          id?: never
          is_completed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_records_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habits_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      habits_systems: {
        Row: {
          created_at: string | null
          habit_id: number
          habit_order: number
          habit_weight: number
          id: number
          modified_at: string | null
          system_id: number
        }
        Insert: {
          created_at?: string | null
          habit_id: number
          habit_order: number
          habit_weight: number
          id?: never
          modified_at?: string | null
          system_id: number
        }
        Update: {
          created_at?: string | null
          habit_id?: number
          habit_order?: number
          habit_weight?: number
          id?: never
          modified_at?: string | null
          system_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "habits_systems_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habits_systems_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code: string
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          modified_at: string | null
          name: string
          starting_date: string
          status: Database["public"]["Enums"]["item_status_type"]
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name: string
          starting_date: string
          status?: Database["public"]["Enums"]["item_status_type"]
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name?: string
          starting_date?: string
          status?: Database["public"]["Enums"]["item_status_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_stages: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          modified_at: string | null
          name: string
          project_id: number
          sort_order: number
          starting_date: string
          status: Database["public"]["Enums"]["item_status_type"] | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name: string
          project_id: number
          sort_order: number
          starting_date: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          weight: number
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name?: string
          project_id?: number
          sort_order?: number
          starting_date?: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_stages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_tasks: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          id: number
          modified_at: string | null
          name: string
          project_id: number | null
          sort_order: number
          stage_id: number | null
          starting_date: string
          status: Database["public"]["Enums"]["item_status_type"] | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name: string
          project_id?: number | null
          sort_order: number
          stage_id?: number | null
          starting_date: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          weight: number
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name?: string
          project_id?: number | null
          sort_order?: number
          stage_id?: number | null
          starting_date?: string
          status?: Database["public"]["Enums"]["item_status_type"] | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "projects_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      systems: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          modified_at: string | null
          name: string
          starting_date: string
          symbol: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name: string
          starting_date: string
          symbol?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          modified_at?: string | null
          name?: string
          starting_date?: string
          symbol?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "systems_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string
          id: string
          last_name: string
          modified_at: string | null
          name: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          email: string
          id: string
          last_name: string
          modified_at?: string | null
          name: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_name?: string
          modified_at?: string | null
          name?: string
        }
        Relationships: []
      }
      users_preferences: {
        Row: {
          created_at: string | null
          dashboard_goals_temporality:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          dashboard_system_accomplisment_range:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          dashboard_system_accomplisment_range_custom_date_end: string | null
          dashboard_system_accomplisment_range_custom_date_start: string | null
          goalsview_goals_temporality:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          habit_accomplisment_range:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          habit_accomplisment_range_custom_date_end: string | null
          habit_accomplisment_range_custom_date_start: string | null
          modified_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dashboard_goals_temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          dashboard_system_accomplisment_range?:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          dashboard_system_accomplisment_range_custom_date_end?: string | null
          dashboard_system_accomplisment_range_custom_date_start?: string | null
          goalsview_goals_temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          habit_accomplisment_range?:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          habit_accomplisment_range_custom_date_end?: string | null
          habit_accomplisment_range_custom_date_start?: string | null
          modified_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dashboard_goals_temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          dashboard_system_accomplisment_range?:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          dashboard_system_accomplisment_range_custom_date_end?: string | null
          dashboard_system_accomplisment_range_custom_date_start?: string | null
          goalsview_goals_temporality?:
            | Database["public"]["Enums"]["goal_temporality_type"]
            | null
          habit_accomplisment_range?:
            | Database["public"]["Enums"]["temporality_select"]
            | null
          habit_accomplisment_range_custom_date_end?: string | null
          habit_accomplisment_range_custom_date_start?: string | null
          modified_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      goal_temporality_type:
        | "long_term"
        | "year"
        | "semester"
        | "quarter"
        | "month"
        | "week"
        | "day"
      habit_scheduling_type:
        | "fixed_weekly_days"
        | "fixed_calendar_days"
        | "each_x_days"
        | "an_amount_into_a_range"
      item_status_type:
        | "not started"
        | "in progress"
        | "discarded"
        | "completed"
      item_type: "goal" | "habit" | "system" | "project"
      temporality_select:
        | "all"
        | "this year"
        | "last 30 days"
        | "last seven days"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      goal_temporality_type: [
        "long_term",
        "year",
        "semester",
        "quarter",
        "month",
        "week",
        "day",
      ],
      habit_scheduling_type: [
        "fixed_weekly_days",
        "fixed_calendar_days",
        "each_x_days",
        "an_amount_into_a_range",
      ],
      item_status_type: [
        "not started",
        "in progress",
        "discarded",
        "completed",
      ],
      item_type: ["goal", "habit", "system", "project"],
      temporality_select: [
        "all",
        "this year",
        "last 30 days",
        "last seven days",
        "custom",
      ],
    },
  },
} as const
