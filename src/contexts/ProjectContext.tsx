import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  title: string;
  category: "womens" | "mens" | "kids" | "animal";
  size_system: "metric";
  size: number;
  garment_type: string;
  fabric_stretch_pct: number;
  seam_allowance_mm: number;
  notes: string;
  reference_image_url?: string;
  include_notches: boolean;
  include_grainline: boolean;
  created_at: string;
}

export interface PrintGuide {
  materials: string[];
  steps: string[];
  settings: Record<string, string>;
}

interface ProjectContextType {
  project: Partial<Project> | null;
  setProject: (p: Partial<Project> | null) => void;
  printGuide: PrintGuide | null;
  setPrintGuide: (g: PrintGuide | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [printGuide, setPrintGuide] = useState<PrintGuide | null>(null);

  return (
    <ProjectContext.Provider value={{ project, setProject, printGuide, setPrintGuide }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
};
