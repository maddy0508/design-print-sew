import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center md:py-36">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Pattern Generation Made Simple
          </p>
          <h1 className="mb-5 text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
            Signature
            <br />
            <span className="bg-gradient-to-r from-[hsl(270,40%,80%)] via-[hsl(340,50%,72%)] to-[hsl(15,70%,68%)] bg-clip-text text-transparent">
              Sewing Studio
            </span>
          </h1>
          <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
            Upload a photo of any garment, select your size, and receive a
            complete printable PDF pattern pack — with instructions, diagrams,
            and materials. No sewing experience needed.
          </p>
          <Button
            variant="couture"
            size="lg"
            onClick={() => navigate("/studio")}
            className="mx-auto px-10"
          >
            Start Designing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Thin divider */}
      <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-12 text-center text-2xl font-semibold md:text-3xl">How It Works</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { num: "01", title: "Upload or Describe", desc: "Share a photo of the garment you love, or describe it in plain language." },
            { num: "02", title: "We Infer Everything", desc: "Fabric type, needle size, stitches, tension — all chosen automatically." },
            { num: "03", title: "Download & Sew", desc: "Get a beautiful PDF pack with patterns, diagrams, and step-by-step instructions." },
          ].map((s) => (
            <div key={s.num} className="text-center">
              <span className="inline-block mb-3 text-3xl font-display font-semibold text-primary/60">{s.num}</span>
              <h3 className="mb-2 text-lg font-semibold font-display">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Landing;
