import jsPDF from "jspdf";
import type { GarmentInference, SizeSystem } from "./inferenceEngine";

interface PdfPackOptions {
  garmentType: string;
  sizeSystem: SizeSystem;
  size: string;
  recommendations: GarmentInference;
  instructions: { step: string; detail: string }[];
}

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Couture palette (HSL to RGB for jsPDF)
const LAVENDER = [178, 160, 210] as const; // hsl(270,40%,80%)
const ROSE = [210, 130, 155] as const;     // hsl(340,50%,72%)
const CORAL = [220, 150, 120] as const;    // hsl(15,70%,68%)
const DARK = [35, 35, 42] as const;
const GRAY = [120, 120, 130] as const;

const addGradientBorder = (doc: jsPDF) => {
  doc.setDrawColor(...LAVENDER);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, PAGE_W - 24, PAGE_H - 24);
  doc.setDrawColor(...ROSE);
  doc.setLineWidth(0.3);
  doc.rect(13, 13, PAGE_W - 26, PAGE_H - 26);
};

const addPageFooter = (doc: jsPDF, pageLabel: string, title: string) => {
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text(`${pageLabel}`, MARGIN, PAGE_H - 12);
  doc.text(`Signature Sewing Studio — ${title}`, PAGE_W / 2, PAGE_H - 12, { align: "center" });
  doc.text(`Page ${doc.getNumberOfPages()}`, PAGE_W - MARGIN, PAGE_H - 12, { align: "right" });
};

export const generatePdfPack = (opts: PdfPackOptions) => {
  const { garmentType, sizeSystem, size, recommendations: rec, instructions } = opts;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const title = `${garmentType} — ${size}`;

  // ═══════════════ PAGE 1: TITLE PAGE ═══════════════
  addGradientBorder(doc);

  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("SIGNATURE SEWING STUDIO", PAGE_W / 2, 50, { align: "center" });

  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(garmentType, PAGE_W / 2, 80, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(`Size ${size} · ${sizeSystem.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}`, PAGE_W / 2, 92, { align: "center" });

  // Fashion sketch placeholder
  doc.setDrawColor(...LAVENDER);
  doc.setLineWidth(0.3);
  doc.setFillColor(250, 248, 252);
  doc.roundedRect(55, 110, 100, 130, 4, 4, "FD");
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text("[ Fashion Sketch ]", PAGE_W / 2, 178, { align: "center" });

  doc.setTextColor(...ROSE);
  doc.setFontSize(9);
  doc.text(`Difficulty: ${rec.difficulty}`, PAGE_W / 2, 255, { align: "center" });

  addPageFooter(doc, "Title", garmentType);

  // ═══════════════ PAGE 2: MATERIALS ═══════════════
  doc.addPage();
  addGradientBorder(doc);

  let y = 35;
  doc.setTextColor(...DARK);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Materials & Supplies", MARGIN, y);
  y += 12;

  // Thin divider
  doc.setDrawColor(...LAVENDER);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + 60, y);
  y += 10;

  const materialItems = [
    { label: "Primary Fabric", value: `${rec.fabricType} — ${rec.fabricQuantityM}m` },
    { label: "Thread", value: rec.thread },
    { label: "Needle", value: `${rec.needleType} (${rec.needleSize})` },
    { label: "Interfacing", value: rec.interfacing },
    ...rec.notions.map((n) => ({ label: "Notion", value: n })),
  ];

  materialItems.forEach((item) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...ROSE);
    doc.text(item.label.toUpperCase(), MARGIN, y);
    doc.setTextColor(...DARK);
    doc.setFontSize(10);
    doc.text(item.value, MARGIN, y + 5);
    y += 14;
  });

  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("STITCH TYPES", MARGIN, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  rec.stitchTypes.forEach((st) => {
    doc.text(`• ${st}`, MARGIN + 2, y);
    y += 6;
  });

  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text("TENSION", MARGIN, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  doc.text(rec.tensionRange, MARGIN, y);

  addPageFooter(doc, "Materials", garmentType);

  // ═══════════════ PAGE 3+: INSTRUCTIONS ═══════════════
  doc.addPage();
  addGradientBorder(doc);

  y = 35;
  doc.setTextColor(...DARK);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Construction Instructions", MARGIN, y);
  y += 12;
  doc.setDrawColor(...LAVENDER);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + 80, y);
  y += 12;

  instructions.forEach((inst, i) => {
    // Check page overflow
    if (y + 50 > PAGE_H - 30) {
      addPageFooter(doc, `Instructions`, garmentType);
      doc.addPage();
      addGradientBorder(doc);
      y = 35;
    }

    // Step number circle
    doc.setFillColor(...LAVENDER);
    doc.circle(MARGIN + 5, y + 1, 4, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(String(i + 1), MARGIN + 5, y + 2, { align: "center" });

    // Step title
    doc.setTextColor(...DARK);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(inst.step, MARGIN + 14, y + 2);
    y += 8;

    // Step detail
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    const lines = doc.splitTextToSize(inst.detail, CONTENT_W - 14);
    doc.text(lines, MARGIN + 14, y);
    y += lines.length * 4.5;

    // Line-art diagram placeholder
    doc.setDrawColor(...LAVENDER);
    doc.setLineWidth(0.2);
    doc.setFillColor(252, 250, 255);
    doc.roundedRect(MARGIN + 14, y + 2, 50, 25, 2, 2, "FD");
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("[ Diagram ]", MARGIN + 39, y + 16, { align: "center" });
    y += 35;
  });

  addPageFooter(doc, "Instructions", garmentType);

  // ═══════════════ PATTERN PAGES ═══════════════
  const patternPages = [
    { label: "1A", piece: "Front Bodice" },
    { label: "1B", piece: "Back Bodice" },
    { label: "2A", piece: "Sleeve" },
    { label: "2B", piece: "Collar / Facing" },
  ];

  patternPages.forEach((pp) => {
    doc.addPage();

    // Page label (large, top-left)
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...LAVENDER);
    doc.text(pp.label, MARGIN, 30);

    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "normal");
    doc.text(pp.piece, MARGIN + 30, 28);

    // Pattern piece placeholder (large area)
    doc.setDrawColor(30, 30, 40);
    doc.setLineWidth(0.5);
    doc.setFillColor(255, 255, 255);
    doc.rect(MARGIN, 40, CONTENT_W, 200);

    // Grainline arrow
    const gx = PAGE_W / 2;
    doc.setDrawColor(...DARK);
    doc.setLineWidth(0.4);
    doc.line(gx, 60, gx, 220);
    // Arrow head
    doc.line(gx - 3, 65, gx, 60);
    doc.line(gx + 3, 65, gx, 60);
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text("GRAINLINE", gx + 4, 140, { angle: 90 });

    // Notches
    [80, 120, 160, 200].forEach((ny) => {
      doc.setLineWidth(0.3);
      doc.setDrawColor(...DARK);
      doc.line(MARGIN, ny, MARGIN + 4, ny);
      doc.line(MARGIN + CONTENT_W - 4, ny, MARGIN + CONTENT_W, ny);
    });

    // Seam allowance note
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(`Seam allowance: ${rec.seamAllowanceMm}mm (included)`, MARGIN, 248);
    doc.text(`Size: ${size}`, MARGIN + 80, 248);

    // Calibration square (5cm × 5cm)
    const sqX = PAGE_W - MARGIN - 50;
    const sqY = 250;
    doc.setDrawColor(...ROSE);
    doc.setLineWidth(0.5);
    doc.rect(sqX, sqY, 50, 50);
    // inner lines
    doc.setLineWidth(0.2);
    for (let i = 10; i < 50; i += 10) {
      doc.line(sqX + i, sqY, sqX + i, sqY + 2);
      doc.line(sqX + i, sqY + 48, sqX + i, sqY + 50);
      doc.line(sqX, sqY + i, sqX + 2, sqY + i);
      doc.line(sqX + 48, sqY + i, sqX + 50, sqY + i);
    }
    doc.setFontSize(7);
    doc.setTextColor(...ROSE);
    doc.text("5 cm", sqX + 25, sqY + 55, { align: "center" });
    doc.text("5 cm", sqX - 3, sqY + 25, { angle: 90 });
    doc.text("CALIBRATION SQUARE — Print at 100%", sqX, sqY - 3);

    addPageFooter(doc, pp.label, garmentType);
  });

  // Save
  const filename = `${garmentType.replace(/\s+/g, "-").toLowerCase()}-${size}-pattern-pack.pdf`;
  doc.save(filename);
};
