// Deterministic inference engine — Phase 1 stub
// Architecture ready for AI-based garment parsing in Phase 2

export interface GarmentInference {
  garmentType: string;
  fabricType: string;
  fabricQuantityM: number;
  needleType: string;
  needleSize: string;
  stitchTypes: string[];
  tensionRange: string;
  seamAllowanceMm: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  notions: string[];
  interfacing: string;
  thread: string;
}

export type SizeSystem = "au_women" | "au_men" | "au_kids" | "dogs";

export interface SizeOption {
  label: string;
  value: string;
}

export const SIZE_SYSTEMS: Record<SizeSystem, { label: string }> = {
  au_women: { label: "AU Women" },
  au_men: { label: "AU Men" },
  au_kids: { label: "AU Kids" },
  dogs: { label: "Dogs" },
};

export const getSizeOptions = (system: SizeSystem): SizeOption[] => {
  switch (system) {
    case "au_women":
      return [6,8,10,12,14,16,18,20,22,24].map(s => ({ label: `Size ${s}`, value: String(s) }));
    case "au_men":
      return ["XS","S","M","L","XL","2XL","3XL","4XL","5XL"].map(s => ({ label: s, value: s }));
    case "au_kids":
      return [0,1,2,3,4,5,6,7,8,10,12,14].map(s => ({ label: `Size ${s}`, value: String(s) }));
    case "dogs":
      return ["XS","S","M","L","XL","2XL"].map(s => ({ label: s, value: s }));
  }
};

const GARMENT_TYPES = [
  "Dress", "Blouse", "Skirt", "Pants", "Jacket", "Coat",
  "T-Shirt", "Tank Top", "Shorts", "Romper", "Jumpsuit",
  "Vest", "Hoodie", "Cardigan", "Dog Coat", "Dog Bandana",
];

export const getGarmentTypes = () => GARMENT_TYPES;

// Deterministic inference based on garment type and size
export const inferFromGarment = (
  garmentType: string,
  sizeSystem: SizeSystem,
  size: string
): GarmentInference => {
  const gt = garmentType.toLowerCase();
  const isKnit = ["t-shirt", "tank top", "hoodie", "romper"].some(k => gt.includes(k));
  const isOuterwear = ["jacket", "coat", "hoodie", "cardigan"].some(k => gt.includes(k));
  const isDog = sizeSystem === "dogs";
  const isSmall = isDog || sizeSystem === "au_kids";

  // Fabric
  let fabricType = isKnit ? "Cotton Jersey" : "Cotton Poplin";
  if (isOuterwear) fabricType = "Wool Blend Suiting";
  if (gt.includes("dress") || gt.includes("blouse")) fabricType = "Cotton Lawn";
  if (gt.includes("skirt")) fabricType = "Cotton Twill";
  if (isDog) fabricType = gt.includes("bandana") ? "Cotton Quilting" : "Polar Fleece";

  // Quantity based on garment complexity and size
  let baseM = 1.5;
  if (isOuterwear) baseM = 2.8;
  if (gt.includes("dress") || gt.includes("jumpsuit")) baseM = 2.5;
  if (gt.includes("pants") || gt.includes("trousers")) baseM = 2.0;
  if (gt.includes("shorts") || gt.includes("skirt")) baseM = 1.2;
  if (gt.includes("blouse") || gt.includes("t-shirt")) baseM = 1.5;
  if (gt.includes("tank")) baseM = 1.0;
  if (gt.includes("vest")) baseM = 1.2;
  if (isDog) baseM = gt.includes("bandana") ? 0.3 : 0.5;
  if (isSmall && !isDog) baseM *= 0.6;

  // Needle
  const needleType = isKnit ? "Ballpoint / Jersey" : "Universal";
  const needleSize = isSmall ? "70/10" : isKnit ? "80/12" : "80/12";

  // Stitches
  const stitchTypes = isKnit
    ? ["Stretch stitch", "Zigzag", "Twin needle hem"]
    : ["Straight stitch", "Zigzag (finishing)", "Topstitch"];
  if (isOuterwear) stitchTypes.push("Blind hem");

  // Tension
  const tensionRange = isKnit ? "3–4" : "4–5";

  // Seam allowance
  const seamAllowanceMm = isDog ? 8 : 15;

  // Difficulty
  let difficulty: GarmentInference["difficulty"] = "Beginner";
  if (isOuterwear || gt.includes("jumpsuit")) difficulty = "Advanced";
  else if (gt.includes("dress") || gt.includes("pants")) difficulty = "Intermediate";

  // Notions
  const notions: string[] = ["Matching thread"];
  if (gt.includes("pants") || gt.includes("skirt")) notions.push("1× Zipper (20cm)");
  if (gt.includes("dress")) notions.push("1× Invisible zipper (55cm)");
  if (isOuterwear) notions.push("5× Buttons", "1× Shoulder pads (optional)");
  if (gt.includes("hoodie")) notions.push("1× Drawcord (120cm)", "2× Cord stops");
  if (isDog && gt.includes("bandana")) notions.push("1× Snap button or velcro strip");

  // Interfacing
  let interfacing = "None required";
  if (isOuterwear) interfacing = "Medium-weight fusible — collars, cuffs, front facing";
  if (gt.includes("blouse") || gt.includes("dress")) interfacing = "Lightweight fusible — collar and facing";

  return {
    garmentType,
    fabricType,
    fabricQuantityM: Math.round(baseM * 10) / 10,
    needleType,
    needleSize,
    stitchTypes,
    tensionRange,
    seamAllowanceMm,
    difficulty,
    notions,
    interfacing,
    thread: "Polyester all-purpose thread — colour-matched",
  };
};

// Stub for Phase 2 AI integration
export const inferFromImage = (_imageUrl: string): string => {
  // In Phase 2, this would call an AI model to detect garment type
  return "Dress";
};

export const inferFromDescription = (description: string): string => {
  const d = description.toLowerCase();
  for (const gt of GARMENT_TYPES) {
    if (d.includes(gt.toLowerCase())) return gt;
  }
  if (d.includes("top")) return "Blouse";
  if (d.includes("trouser")) return "Pants";
  if (d.includes("sweater") || d.includes("pullover")) return "Hoodie";
  return "Dress"; // default
};

// Generate step-by-step construction instructions
export const generateInstructions = (inference: GarmentInference): { step: string; detail: string }[] => {
  const steps: { step: string; detail: string }[] = [];
  const gt = inference.garmentType.toLowerCase();

  steps.push({
    step: "Prepare your fabric",
    detail: `Pre-wash and press ${inference.fabricType}. Fold fabric with selvedges together, right sides facing.`,
  });

  steps.push({
    step: "Print and assemble pattern",
    detail: `Print all pages at 100% scale. Verify the 5cm calibration square. Tape pages together matching labels (1A→1B, etc).`,
  });

  steps.push({
    step: "Cut pattern pieces",
    detail: `Pin pattern to fabric, aligning grainline arrows with selvedge. Cut with ${inference.seamAllowanceMm}mm seam allowance included. Transfer all notch marks.`,
  });

  if (gt.includes("dress") || gt.includes("blouse") || gt.includes("jacket")) {
    steps.push({
      step: "Apply interfacing",
      detail: `${inference.interfacing}. Fuse with iron on medium heat, pressing for 10–15 seconds per section.`,
    });
  }

  steps.push({
    step: "Sew main seams",
    detail: `Using ${inference.stitchTypes[0]} at tension ${inference.tensionRange}, join main body pieces. Match notches for alignment. Use ${inference.needleType} needle (${inference.needleSize}).`,
  });

  if (gt.includes("dress") || gt.includes("skirt") || gt.includes("pants")) {
    steps.push({
      step: "Insert closure",
      detail: `Install zipper using a zipper foot. For invisible zippers, sew close to the coil with teeth unfolded.`,
    });
  }

  steps.push({
    step: "Finish seams",
    detail: `Finish raw edges with ${inference.stitchTypes[1]} or serger. Press seams open or to one side as directed.`,
  });

  steps.push({
    step: "Hem and final details",
    detail: `Fold and press hem. Stitch using ${inference.stitchTypes[inference.stitchTypes.length - 1]}. Attach any buttons, snaps, or hardware.`,
  });

  steps.push({
    step: "Final pressing and fitting",
    detail: `Give the finished garment a thorough press. Try on and make any final adjustments to fit.`,
  });

  return steps;
};
