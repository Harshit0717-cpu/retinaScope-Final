from pathlib import Path
import shutil
import tempfile

root = Path(__file__).resolve().parent
if not (root / 'frontend/app/page.tsx').is_file():
    root = Path.cwd()
page = root / 'frontend/app/page.tsx'
component = root / 'frontend/app/report-download.tsx'
if not page.is_file():
    raise SystemExit('Run this script from the RetinaScope project root.')

source = page.read_text(encoding='utf-8')
new_component = r'''"use client";

import { useEffect, useRef, useState } from "react";

type ReportProps = { predictUrl: string } & (
  | { mode: "single"; file: File }
  | { mode: "both"; rightFile: File; leftFile: File }
);

export default function ReportDownload(props: ReportProps) {
  const [eye, setEye] = useState("Not specified");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const singleFile = props.mode === "single" ? props.file : null;
  const rightFile = props.mode === "both" ? props.rightFile : null;
  const leftFile = props.mode === "both" ? props.leftFile : null;
  useEffect(() => {
    setBusy(false);
    setMessage("");
    setEye("Not specified");
    return () => requestRef.current?.abort();
  }, [singleFile, rightFile, leftFile]);

  const download = async () => {
    if (requestRef.current || busy) return;
    const base = props.predictUrl.replace(/\/+$/, "");
    if (!base.endsWith("/api/predict")) {
      setMessage("The report API could not be derived from the configured prediction URL.");
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData();
      const now = new Date();
      const patient: Record<string, string> = {
        "Case ID": `DEMO-${now.getTime()}`,
        "Screening Date": now.toLocaleDateString("en-GB"),
        "Patient Name": "Anonymous demonstration",
        "Age": "Not supplied",
        "Sex": "Not supplied",
        "Screening Centre": "RetinaScope AI research demo",
        "Diabetes Type": "Not supplied",
        "Diabetes Duration": "Not supplied",
        "Previous DR": "Not supplied",
        "Previous Eye Exam": "Not supplied",
      };
      let endpoint = base.replace(/\/api\/predict$/, "/api/report");
      if (props.mode === "single") {
        form.append("file", props.file);
        patient["Eye Examined"] = eye;
        patient["Image ID"] = "DEMO-IMAGE";
      } else {
        endpoint += "/dual";
        form.append("right_file", props.rightFile);
        form.append("left_file", props.leftFile);
        patient["Right Image ID"] = "DEMO-RIGHT";
        patient["Left Image ID"] = "DEMO-LEFT";
      }
      form.append("patient", JSON.stringify(patient));
      const response = await fetch(endpoint, { method: "POST", body: form, signal: controller.signal });
      if (!response.ok) throw new Error(`Report service returned HTTP ${response.status}.`);
      if (!response.headers.get("content-type")?.toLowerCase().includes("application/pdf")) {
        throw new Error("The report service did not return a PDF.");
      }
      const blob = await response.blob();
      if (controller.signal.aborted) return;
      if (!blob.size) throw new Error("The report service returned an empty PDF.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = props.mode === "single" ? "RetinaScope_Single_Eye_Report.pdf" : "RetinaScope_Dual_Eye_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setMessage("PDF download started.");
    } catch (error) {
      if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Report generation failed. Please try again.");
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  };

  return (
    <div className="result-card" style={{ marginTop: 20, padding: 20 }}>
      <div className="result-card-heading">
        <div><span className="panel-kicker">RESEARCH DOCUMENTATION</span><h3>Download screening report</h3></div>
      </div>
      <p className="clinical-caveat">Generate an anonymous PDF with model outputs, retinal images and Grad-CAM visualizations. The selected images will be sent to the configured screening backend again. Use authorized, de-identified images only. This is not a clinical diagnosis.</p>
      {props.mode === "single" && (
        <label style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          <span>Eye examined</span>
          <select value={eye} onChange={(event) => setEye(event.target.value)} disabled={busy} style={{ color: "inherit", background: "transparent", border: "1px solid currentColor", borderRadius: 6, padding: 8 }}>
            <option value="Not specified">Not specified</option>
            <option value="Right">Right eye</option>
            <option value="Left">Left eye</option>
          </select>
        </label>
      )}
      <div style={{ marginTop: 16 }}>
        <button className="button button-primary" type="button" disabled={busy} onClick={download}>
          {busy ? "Generating PDF..." : "Download PDF report"}
        </button>
      </div>
      {message && <p role="status" style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
'''
# On reusing a mounted component, clear any aborted request before a new download.
new_component = new_component.replace('return () => requestRef.current?.abort();', 'return () => {\n      requestRef.current?.abort();\n      requestRef.current = null;\n    };')

replacements = [
    ('import Image from "next/image";', 'import Image from "next/image";\nimport ReportDownload from "./report-download";'),
    ('            <div className="results-actions">\n              <button className="button button-secondary" type="button" onClick={resetUpload}><Icon name="refresh" size={16} /> Upload another set</button>', '            {resultMode === "live" && rightEyeFile && leftEyeFile && (\n              <ReportDownload mode="both" predictUrl={PREDICT_URL} rightFile={rightEyeFile} leftFile={leftEyeFile} />\n            )}\n            <div className="results-actions">\n              <button className="button button-secondary" type="button" onClick={resetUpload}><Icon name="refresh" size={16} /> Upload another set</button>'),
    ('            <div className="results-actions">\n              <button className="button button-secondary" type="button" onClick={resetUpload}><Icon name="refresh" size={16} /> Upload another image</button>', '            {resultMode === "live" && selectedFile && (\n              <ReportDownload mode="single" predictUrl={PREDICT_URL} file={selectedFile} />\n            )}\n            <div className="results-actions">\n              <button className="button button-secondary" type="button" onClick={resetUpload}><Icon name="refresh" size={16} /> Upload another image</button>'),
]
if 'import ReportDownload from "./report-download";' in source:
    raise SystemExit('Report patch already present; no files changed.')
if component.exists():
    raise SystemExit('report-download.tsx already exists; no files changed.')
for old, new in replacements:
    if source.count(old) != 1:
        raise SystemExit('Expected source anchor not found uniquely. No files changed; send page.tsx for review.')
    source = source.replace(old, new, 1)
backup = Path(tempfile.mkdtemp(prefix='retinascope-report-backup-'))
shutil.copy2(page, backup / 'page.tsx')
try:
    component.write_text(new_component, encoding='utf-8')
    page.write_text(source, encoding='utf-8')
except Exception:
    shutil.copy2(backup / 'page.tsx', page)
    component.unlink(missing_ok=True)
    raise
print('Updated: frontend/app/page.tsx')
print('Created: frontend/app/report-download.tsx')
print(f'Backup: {backup}')
print('Run npm run build inside frontend. Test single-eye and dual-eye report downloads before pushing.')
