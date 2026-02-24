import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Loader2, ImageIcon, X, ChevronDown } from "lucide-react";
import {
  type SizeSystem,
  SIZE_SYSTEMS,
  getSizeOptions,
  getGarmentTypes,
  inferFromGarment,
  inferFromDescription,
  generateInstructions,
  type GarmentInference,
} from "@/lib/inferenceEngine";
import { generatePdfPack } from "@/lib/pdfGenerator";

const Studio = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [sizeSystem, setSizeSystem] = useState<SizeSystem | "">("");
  const [size, setSize] = useState("");
  const [garmentOverride, setGarmentOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const sizeOptions = sizeSystem ? getSizeOptions(sizeSystem as SizeSystem) : [];

  // Infer garment type from description or default
  const inferredGarment = useMemo(() => {
    if (garmentOverride) return garmentOverride;
    if (description.trim()) return inferFromDescription(description);
    return "";
  }, [description, garmentOverride]);

  // Generate recommendations when we have enough data
  const recommendations: GarmentInference | null = useMemo(() => {
    if (!inferredGarment || !sizeSystem || !size) return null;
    return inferFromGarment(inferredGarment, sizeSystem as SizeSystem, size);
  }, [inferredGarment, sizeSystem, size]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
  }, []);

  const canGenerate = !!inferredGarment && !!sizeSystem && !!size;

  const handleGenerate = async () => {
    if (!recommendations) return;
    setLoading(true);
    // Simulate generation
    await new Promise((r) => setTimeout(r, 2000));

    const instructions = generateInstructions(recommendations);
    generatePdfPack({
      garmentType: recommendations.garmentType,
      sizeSystem: sizeSystem as SizeSystem,
      size,
      recommendations,
      instructions,
    });

    setLoading(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-4 py-5">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Signature Sewing Studio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-body">
            Upload a garment image or describe it — we'll handle the rest.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left column — Inputs */}
          <div className="space-y-6">
            {/* Image Upload */}
            <section>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                Upload Image
              </Label>
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
                  <img
                    src={imagePreview}
                    alt="Uploaded garment"
                    className="mx-auto max-h-72 object-contain p-4"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-full bg-background/90 p-1.5 shadow-sm hover:bg-background transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 py-12 transition-colors hover:border-primary/40 hover:bg-muted/40">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Drop an image here or <span className="text-primary">browse</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </section>

            {/* Description */}
            <section>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                Or Describe Your Garment
              </Label>
              <Textarea
                placeholder="e.g. A knee-length A-line dress with short sleeves and a square neckline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none bg-background"
              />
            </section>

            {/* Size selectors */}
            <div className="grid gap-4 sm:grid-cols-2">
              <section>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  Size System
                </Label>
                <Select
                  value={sizeSystem}
                  onValueChange={(v) => {
                    setSizeSystem(v as SizeSystem);
                    setSize("");
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select size system" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SIZE_SYSTEMS).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              <section>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  Size
                </Label>
                <Select value={size} onValueChange={setSize} disabled={!sizeSystem}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={sizeSystem ? "Select size" : "Choose system first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>
            </div>

            {/* Garment type override */}
            <section>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                Garment Type {inferredGarment && !garmentOverride && (
                  <span className="ml-1 normal-case text-primary">(auto-detected: {inferredGarment})</span>
                )}
              </Label>
              <Select value={garmentOverride} onValueChange={setGarmentOverride}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={inferredGarment ? `${inferredGarment} (auto)` : "Select or let us detect"} />
                </SelectTrigger>
                <SelectContent>
                  {getGarmentTypes().map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            {/* Generate Button */}
            <Button
              variant="couture"
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={!canGenerate || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating PDF Pack…
                </>
              ) : generated ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Downloaded! Generate Again?
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate PDF Pack
                </>
              )}
            </Button>
          </div>

          {/* Right column — Preview / Recommendations */}
          <aside className="space-y-5">
            {/* Preview card */}
            <Card className="overflow-hidden shadow-card">
              <div className="flex items-center justify-center bg-muted/30 py-16">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 object-contain opacity-70"
                    style={{ filter: "grayscale(40%) contrast(1.1)" }}
                  />
                ) : inferredGarment ? (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-primary/30">
                      <ImageIcon className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{inferredGarment} silhouette</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-xs">Upload or describe a garment to see preview</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Recommendations */}
            {recommendations && (
              <Card className="shadow-card">
                <CardContent className="p-5">
                  <h3 className="mb-4 text-lg font-semibold font-display">What We Chose For You</h3>
                  <div className="space-y-3">
                    <RecommendationRow label="Fabric" value={recommendations.fabricType} />
                    <RecommendationRow label="Fabric Needed" value={`${recommendations.fabricQuantityM}m`} />
                    <RecommendationRow label="Needle" value={`${recommendations.needleType} (${recommendations.needleSize})`} />
                    <RecommendationRow label="Stitches" value={recommendations.stitchTypes.join(", ")} />
                    <RecommendationRow label="Tension" value={recommendations.tensionRange} />
                    <RecommendationRow label="Difficulty" value={recommendations.difficulty} />
                    <div className="border-t border-border pt-3 mt-3">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Notions</p>
                      <ul className="space-y-1">
                        {recommendations.notions.map((n, i) => (
                          <li key={i} className="text-xs text-foreground/80">• {n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

const RecommendationRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-3">
    <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">{label}</span>
    <span className="text-sm text-right text-foreground/90">{value}</span>
  </div>
);

export default Studio;
