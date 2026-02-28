};

// Deterministic inference engine (mirrors client-side logic)
function inferFromGarment(garmentType: string, sizeSystem: string, size: string) {
  const gt = garmentType.toLowerCase();
  const isKnit = ["t-shirt", "tank top", "hoodie", "romper"].some((k) => gt.includes(k));
  const isOuterwear = ["jacket", "coat", "hoodie", "cardigan"].some((k) => gt.includes(k));
  const isDog = sizeSystem === "dogs";
  const isSmall = isDog || sizeSystem === "au_kids";

  let fabricType = isKnit ? "Cotton Jersey" : "Cotton Poplin";
  if (isOuterwear) fabricType = "Wool Blend Suiting";
  if (gt.includes("dress") || gt.includes("blouse")) fabricType = "Cotton Lawn";
  if (gt.includes("skirt")) fabricType = "Cotton Twill";
  if (isDog) fabricType = gt.includes("bandana") ? "Cotton Quilting" : "Polar Fleece";

  let baseM = 1.5;
  if (isOuterwear) baseM = 2.8;
  if (gt.includes("dress") || gt.includes("jumpsuit")) baseM = 2.5;
  if (gt.includes("pants") || gt.includes("trousers")) baseM = 2.0;
  if (gt.includes("shorts") || gt.includes("skirt")) baseM = 1.2;
  if (gt.includes("tank")) baseM = 1.0;
  if (gt.includes("vest")) baseM = 1.2;
  if (isDog) baseM = gt.includes("bandana") ? 0.3 : 0.5;
  if (isSmall && !isDog) baseM *= 0.6;

  const needleType = isKnit ? "Ballpoint / Jersey" : "Universal";
  const needleSize = isSmall ? "70/10" : "80/12";
  const stitchTypes = isKnit
    ? ["Stretch stitch", "Zigzag", "Twin needle hem"]
    : ["Straight stitch", "Zigzag (finishing)", "Topstitch"];
  if (isOuterwear) stitchTypes.push("Blind hem");

  const tensionRange = isKnit ? "3–4" : "4–5";
  const seamAllowanceMm = isDog ? 8 : 15;

  let difficulty = "Beginner";
  if (isOuterwear || gt.includes("jumpsuit")) difficulty = "Advanced";
  else if (gt.includes("dress") || gt.includes("pants")) difficulty = "Intermediate";

  const notions: string[] = ["Matching thread"];
  if (gt.includes("pants") || gt.includes("skirt")) notions.push("1× Zipper (20cm)");
  if (gt.includes("dress")) notions.push("1× Invisible zipper (55cm)");
  if (isOuterwear) notions.push("5× Buttons", "1× Shoulder pads (optional)");

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
}

function inferGarmentFromDescription(description: string): string {
  const d = description.toLowerCase();
  const types = ["Dress", "Blouse", "Skirt", "Pants", "Jacket", "Coat", "T-Shirt", "Hoodie", "Shorts", "Vest"];
  for (const gt of types) {
    if (d.includes(gt.toLowerCase())) return gt;
  }
  if (d.includes("top")) return "Blouse";
  if (d.includes("trouser")) return "Pants";
  return "Dress";
}
  try {
    const body = await req.json();
    const { description, size_system, size, garment_type_override } = body;

    if (!size_system || !size) {
      return new Response(
        JSON.stringify({ error: "size_system and size are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const garmentType = garment_type_override || (description ? inferGarmentFromDescription(description) : "Dress");
    const recommendations = inferFromGarment(garmentType, size_system, size);

    return new Response(
      JSON.stringify({
        projectId: crypto.randomUUID(),
        garmentType,
        recommendations,
        pdfPackUrl: null, // Client-side PDF generation in Phase 1
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
