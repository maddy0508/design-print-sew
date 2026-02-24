import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
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
import StepIndicator from "@/components/StepIndicator";
import { ArrowRight } from "lucide-react";

const GARMENT_TYPES: Record<string, string[]> = {
  womens: ["Dress", "Blouse", "Skirt", "Pants", "Jacket"],
  mens: ["Shirt", "Trousers", "Jacket", "Vest", "Shorts"],
  kids: ["Onesie", "T-Shirt", "Dress", "Pants", "Romper"],
  animal: ["Dog Coat", "Cat Sweater", "Pet Bandana"],
};

const STEPS = ["Project", "Parameters", "Generate"];

const NewProject = () => {
  const navigate = useNavigate();
  const { setProject } = useProject();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const garmentOptions = category ? GARMENT_TYPES[category] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category || !size || !garmentType) {
      setError("Please fill in all required fields.");
      return;
    }
    setProject({
      id: crypto.randomUUID(),
      title: title.trim(),
      category: category as "womens" | "mens" | "kids" | "animal",
      size_system: "metric",
      size: Number(size),
      garment_type: garmentType,
      notes,
      created_at: new Date().toISOString(),
      fabric_stretch_pct: 0,
      seam_allowance_mm: 10,
      include_notches: true,
      include_grainline: true,
    });
    navigate("/studio-parameters");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-lg">
        <StepIndicator currentStep={0} steps={STEPS} />
        <h1 className="mb-1 text-3xl font-bold text-center">New Project</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Define your garment details to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Summer Linen Dress"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setGarmentType("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="womens">Women's</SelectItem>
                <SelectItem value="mens">Men's</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="animal">Animal / Pet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size">Size (metric) *</Label>
            <Input
              id="size"
              type="number"
              placeholder="e.g. 42"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              min={1}
              max={200}
            />
          </div>

          <div>
            <Label>Garment Type *</Label>
            <Select value={garmentType} onValueChange={setGarmentType} disabled={!category}>
              <SelectTrigger>
                <SelectValue placeholder={category ? "Select type" : "Choose a category first"} />
              </SelectTrigger>
              <SelectContent>
                {garmentOptions.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" variant="hero" size="lg" className="w-full">
            Create Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
