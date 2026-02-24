import jsPDF from "jspdf";
import type { Project, PrintGuide } from "@/contexts/ProjectContext";

export const generatePdf = (project: Partial<Project>, guide: PrintGuide) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const addText = (text: string, size: number, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentW);
    if (y + lines.length * size * 0.4 > 277) {
      addPageNumber();
      doc.addPage();
      y = margin;
    }
    doc.text(lines, margin, y);
    y += lines.length * size * 0.45 + 2;
  };

  const addPageNumber = () => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${doc.getNumberOfPages()} — ${project.title || "Project"}`,
      pageW / 2,
      290,
      { align: "center" }
    );
  };

  // Title
  addText("Signature Sewing Studio", 20, true);
  addText(project.title || "Untitled Project", 16, true);
  y += 5;

  // Settings
  addText("Project Settings", 13, true);
  Object.entries(guide.settings).forEach(([key, val]) => {
    addText(`${key}: ${val}`, 10);
  });
  y += 5;

  // Calibration square
  addText("Calibration Square (5cm × 5cm)", 11, true);
  addText("Measure this square to verify print scale is 100%.", 9);
  const sqSize = 50; // 50mm = 5cm
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, sqSize, sqSize);
  doc.setFontSize(7);
  doc.text("5 cm", margin + sqSize / 2, y + sqSize + 4, { align: "center" });
  doc.text("5 cm", margin - 4, y + sqSize / 2, { angle: 90 });
  y += sqSize + 12;

  // Materials
  addText("Materials Needed", 13, true);
  guide.materials.forEach((m, i) => addText(`${i + 1}. ${m}`, 10));
  y += 5;

  // Steps
  addText("Assembly Steps", 13, true);
  guide.steps.forEach((s, i) => addText(`${i + 1}. ${s}`, 10));

  addPageNumber();

  doc.save(`${(project.title || "pattern").replace(/\s+/g, "-").toLowerCase()}-pattern.pdf`);
};
