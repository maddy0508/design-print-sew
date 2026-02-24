import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Download, Printer, Home, ArrowLeft } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import { generatePdf } from "@/lib/pdfGenerator";

const STEPS = ["Project", "Parameters", "Generate"];

const Output = () => {
  const navigate = useNavigate();
  const { project, printGuide } = useProject();

  if (!project || !printGuide) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">No generated pattern found.</p>
          <Button variant="hero" onClick={() => navigate("/new-project")}>
            Start New Project
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    generatePdf(project, printGuide);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <StepIndicator currentStep={2} steps={STEPS} />
        <h1 className="mb-1 text-3xl font-bold text-center">Your Pattern is Ready</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Print guide and downloadable PDF for <span className="font-medium text-foreground">{project.title}</span>
        </p>

        {/* Actions */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="hero" size="lg" className="flex-1" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Guide
          </Button>
        </div>

        {/* Settings Summary */}
        <section className="mb-6 rounded-xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-xl font-semibold">Project Settings</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(printGuide.settings).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground">{key}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Materials */}
        <section className="mb-6 rounded-xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-xl font-semibold">Materials Needed</h2>
          <ul className="space-y-2">
            {printGuide.materials.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="mb-8 rounded-xl bg-card p-6 shadow-card">
          <h2 className="mb-4 text-xl font-semibold">Assembly Steps</h2>
          <ol className="space-y-3">
            {printGuide.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full gradient-warm text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer Nav */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/studio-parameters")} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Edit Parameters
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Output;
