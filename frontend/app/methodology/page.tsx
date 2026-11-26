import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RetinaScope AI Research Methodology | Team Shadow",
  description: "Learn how RetinaScope AI processes fundus images, classifies diabetic retinopathy, produces Grad-CAM explanations and supports district planning, including research limitations.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "RetinaScope AI Research Methodology",
    description: "Model architecture, screening workflow and limitations of the Team Shadow research prototype.",
    url: "https://retina-scope-final.vercel.app/methodology",
    siteName: "RetinaScope AI",
    type: "website",
  },
};

export default function MethodologyPage() {
  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px", lineHeight: 1.8 }}>
      <Link href="/" style={{ textDecoration: "underline" }}>← RetinaScope AI home</Link>
      <p style={{ marginTop: 32, fontWeight: 600 }}>TEAM SHADOW / RESEARCH &amp; DEMONSTRATION</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15, margin: "16px 0 24px" }}>RetinaScope AI research methodology</h1>
      <p>RetinaScope AI explores explainable screening of diabetic retinopathy from retinal fundus photographs. The project combines image classification, visual explanations, comparison of both eyes and district-level screening resource planning.</p>
      <section style={{ marginTop: 32 }}>
        <h2>Retinal image processing and model</h2>
        <p>Fundus images are resized to 224 × 224 pixels, contrast-enhanced using CLAHE, lightly denoised and normalized. A trained EfficientNet-B0 model produces scores for five diabetic retinopathy grades: no DR, mild, moderate, severe and proliferative DR. The application supports one or two uploaded retinal images.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Explainable AI with Grad-CAM</h2>
        <p>Gradient-weighted class activation mapping visualizes regions contributing to a predicted class. The heatmap is an explanation of model behavior, not a verified lesion annotation or proof of a diagnosis. Both eyes can be reviewed separately in dual-eye mode.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Model evaluation and limitations</h2>
        <p>The deployed checkpoint records internal validation accuracy of approximately 80.08% and macro F1 of 0.6486. These figures are project validation results, not independent clinical validation. External evaluation, calibration, image-quality assessment and prospective clinical studies are needed before clinical use. Model confidence is not a calibrated probability of disease.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>District-level healthcare planning</h2>
        <p>The planning interface explores estimated screening demand, capacity gaps and priorities using district-level project data. These estimates are illustrative planning inputs rather than independently verified service inventories or individual patient records.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Responsible use and image privacy</h2>
        <p>RetinaScope AI is a research and demonstration prototype, not a medical device or a substitute for professional examination. Live analysis sends the selected file to the hosted backend. Use only authorized, de-identified demonstration images; do not upload identifiable patient information. Screening results require qualified eye-care professional review.</p>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Project source and technical references</h2>
        <p>Explore the <a href="https://github.com/Harshit0717-cpu/retinaScope-Final" style={{ textDecoration: "underline" }}>RetinaScope AI source repository</a>, including the Next.js frontend and FastAPI/PyTorch backend.</p>
        <p><a href="https://proceedings.mlr.press/v97/tan19a.html" style={{ textDecoration: "underline" }}>EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks (2019)</a> · <a href="https://arxiv.org/abs/1610.02391" style={{ textDecoration: "underline" }}>Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization</a></p>
      </section>
      <p style={{ marginTop: 40 }}><Link href="/" style={{ textDecoration: "underline" }}>Return to the screening workspace</Link></p>
    </main>
  );
}
