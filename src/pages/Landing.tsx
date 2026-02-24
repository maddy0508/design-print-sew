import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-sewing.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 max-w-lg">
          <h1 className="mb-3 text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl">
            Signature Sewing Studio
          </h1>
          <p className="mb-8 text-lg font-light text-primary-foreground/80">
            Turn your vision into precise, printable sewing patterns — from idea to fabric in minutes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/new-project")}>
              <Scissors className="mr-2 h-5 w-5" />
              Start Designing
            </Button>
            <Button
              variant="outline-warm"
              size="lg"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => navigate("/gallery")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-4xl gap-8 px-6 py-16 md:grid-cols-3">
        {[
          { title: "Design", desc: "Input your project specs and garment type" },
          { title: "Generate", desc: "Get a print-ready pattern with calibration guides" },
          { title: "Sew", desc: "Follow the step-by-step print guide to create" },
        ].map((f, i) => (
          <div key={f.title} className="rounded-xl bg-card p-6 shadow-card text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full gradient-warm text-primary-foreground font-display text-lg font-bold">
              {i + 1}
            </div>
            <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Landing;
