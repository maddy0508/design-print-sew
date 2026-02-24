import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject, PrintGuide } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import StepIndicator from "@/components/StepIndicator";
import { Loader2, Sparkles } from "lucide-react";

const STEPS = ["Project", "Parameters", "Generate"];

const generatePrintGuide = (project: any): PrintGuide => {
  const { title, garment_type, category, size, fabric_stretch_pct, seam_allowance_mm, include_notches, include_grainline } = project;
  return {
    materials: [
      `Primary fabric: 2.5m (${garment_type}, ${category})`,
      `Matching thread: 1 spool`,
      seam_allowance_mm > 10 ? `Interfacing: 0.5m` : "",
      `Pins, scissors, marking chalk`,
      include_notches ? `Notch cutter or snips` : "",
    ].filter(Boolean),
    steps: [
      `Print all pattern pages and verify 5cm calibration square.`,
      `Cut along solid lines with ${seam_allowance_mm}mm seam allowance included.`,
      include_notches ? `Transfer all notch markings to fabric.` : "",
      include_grainline ? `Align grainline arrows with fabric selvedge.` : "",
      `Pin pattern pieces to fabric (${fabric_stretch_pct}% stretch considered).`,
      `Cut fabric pieces for size ${size}.`,
      `Assemble following numbered sequence.`,
      `Press seams and finish edges.`,
      `Final fitting and adjustments.`,
    ].filter(Boolean),
    settings: {
      "Project": title,
      "Garment": garment_type,
      "Category": category,
      "Size": `${size} (metric)`,
      "Fabric Stretch": `${fabric_stretch_pct}%`,
      "Seam Allowance": `${seam_allowance_mm}mm`,
      "Notches": include_notches ? "Included" : "Not included",
      "Grainline": include_grainline ? "Included" : "Not included",
    },
  };
};

const StudioParameters = () => {
  const navigate = useNavigate();
  const { project, setProject, setPrintGuide } = useProject();
  const [stretchPct, setStretchPct] = useState(String(project?.fabric_stretch_pct ?? 0));
  const [seamAllowance, setSeamAllowance] = useState(String(project?.seam_allowance_mm ?? 10));
  const [includeNotches, setIncludeNotches] = useState(project?.include_notches ?? true);
  const [includeGrainline, setIncludeGrainline] = useState(project?.include_grainline ?? true);
  const [loading, setLoading] = useState(false);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">No project found. Please start from the beginning.</p>
          <Button variant="hero" onClick={() => navigate("/new-project")}>
            Start New Project
          </Button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    const updatedProject = {
      ...project,
      fabric_stretch_pct: Number(stretchPct),
      seam_allowance_mm: Number(seamAllowance),
      include_notches: includeNotches,
      include_grainline: includeGrainline,
    };
    setProject(updatedProject);

    // Simulate generation delay
    await new Promise((r) => setTimeout(r, 1500));

    const guide = generatePrintGuide(updatedProject);
    setPrintGuide(guide);
    setLoading(false);
    navigate("/output");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-lg">
        <StepIndicator currentStep={1} steps={STEPS} />
        <h1 className="mb-1 text-3xl font-bold text-center">Studio Parameters</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Fine-tune your pattern settings for <span className="font-medium text-foreground">{project.title}</span>
        </p>

        <div className="space-y-6">
          <div>
            <Label htmlFor="stretch">Fabric Stretch (%)</Label>
            <Input
              id="stretch"
              type="number"
              min={0}
              max={100}
              value={stretchPct}
              onChange={(e) => setStretchPct(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">0% for woven, 5-25% for knits</p>
          </div>

          <div>
            <Label htmlFor="seam">Seam Allowance (mm)</Label>
            <Input
              id="seam"
              type="number"
              min={3}
              max={30}
              value={seamAllowance}
              onChange={(e) => setSeamAllowance(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <Label className="text-base">Include Notches</Label>
              <p className="text-xs text-muted-foreground">Alignment marks for assembly</p>
            </div>
            <Switch checked={includeNotches} onCheckedChange={setIncludeNotches} />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-card p-4 shadow-card">
            <div>
              <Label className="text-base">Include Grainline</Label>
              <p className="text-xs text-muted-foreground">Fabric direction indicators</p>
            </div>
            <Switch checked={includeGrainline} onCheckedChange={setIncludeGrainline} />
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Pattern
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudioParameters;
