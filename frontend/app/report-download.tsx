"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type ReportProps = { predictUrl: string } & (
  | { mode: "single"; file: File }
  | { mode: "both"; rightFile: File; leftFile: File }
);

type Field = { key: string; label?: string; type?: "date" | "number"; options?: string[]; placeholder?: string };

const commonFields: Field[] = [
  { key: "Case ID", placeholder: "Anonymous case reference" },
  { key: "Screening Date", type: "date" },
  { key: "Patient Name", label: "Patient name / anonymous alias", placeholder: "Demo patient" },
  { key: "Age", type: "number", placeholder: "Age in years" },
  { key: "Sex", options: ["Not supplied", "Male", "Female", "Other", "Prefer not to say"] },
  { key: "Screening Centre", placeholder: "Demo screening centre" },
];
const historyFields: Field[] = [
  { key: "Diabetes Type", options: ["Not supplied", "Type 1", "Type 2", "Gestational", "Other", "Unknown", "No known diabetes"] },
  { key: "Diabetes Duration", placeholder: "e.g. 5 years" },
  { key: "Previous DR", options: ["Not supplied", "Yes", "No", "Unknown"] },
  { key: "Previous Eye Exam", placeholder: "e.g. 6 months ago" },
];
function initialPatient(): Record<string, string> {
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return {
    "Case ID": `DEMO-${now.getTime()}`,
    "Screening Date": date,
    "Patient Name": "Anonymous demonstration",
    "Age": "", "Sex": "Not supplied",
    "Screening Centre": "RetinaScope AI research demo",
    "Eye Examined": "Not specified", "Image ID": "DEMO-IMAGE",
    "Right Image ID": "DEMO-RIGHT", "Left Image ID": "DEMO-LEFT",
    "Diabetes Type": "Not supplied", "Diabetes Duration": "",
    "Previous DR": "Not supplied", "Previous Eye Exam": "",
  };
}
const fieldStyle: CSSProperties = {
  width: "100%", minWidth: 0, boxSizing: "border-box", color: "inherit",
  background: "transparent", border: "1px solid currentColor", borderRadius: 8,
  padding: "10px 12px", font: "inherit",
};

export default function ReportDownload(props: ReportProps) {
  const [patientFields, setPatientFields] = useState(initialPatient);
  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const singleFile = props.mode === "single" ? props.file : null;
  const rightFile = props.mode === "both" ? props.rightFile : null;
  const leftFile = props.mode === "both" ? props.leftFile : null;
  useEffect(() => {
    setBusy(false);
    setMessage("");
    setPatientFields(initialPatient());
    setAuthorized(false);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [singleFile, rightFile, leftFile]);

  const download = async () => {
    if (requestRef.current || busy || !authorized) return;
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
      const eyeFields: Field[] = props.mode === "single"
        ? [{ key: "Eye Examined" }, { key: "Image ID" }]
        : [{ key: "Right Image ID" }, { key: "Left Image ID" }];
      const patient: Record<string, string> = {};
      for (const { key } of [...commonFields, ...eyeFields, ...historyFields]) {
        patient[key] = patientFields[key]?.trim() || "Not supplied";
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(patient["Screening Date"])) {
        patient["Screening Date"] = patient["Screening Date"].split("-").reverse().join("/");
      }
      let endpoint = base.replace(/\/api\/predict$/, "/api/report");
      if (props.mode === "single") {
        form.append("file", props.file);
      } else {
        endpoint += "/dual";
        form.append("right_file", props.rightFile);
        form.append("left_file", props.leftFile);
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

  const fields: Field[] = [
    ...commonFields,
    ...(props.mode === "single"
      ? [{ key: "Eye Examined", options: ["Not specified", "Right", "Left"] }, { key: "Image ID", placeholder: "Anonymous image ID" }]
      : [{ key: "Right Image ID", placeholder: "Anonymous right-eye image ID" }, { key: "Left Image ID", placeholder: "Anonymous left-eye image ID" }]),
    ...historyFields,
  ];
  return (
    <div className="result-card" style={{ marginTop: 20, padding: 20 }}>
      <div className="result-card-heading">
        <div><span className="panel-kicker">RESEARCH DOCUMENTATION</span><h3>Patient information &amp; PDF report</h3></div>
      </div>
      <p className="clinical-caveat">Enter fictional or de-identified details for this research demo. The form and selected retinal images are sent to the screening backend when generating the PDF. Do not enter real names or identifying records. This is not a clinical diagnosis.</p>
      <form onSubmit={(event) => { event.preventDefault(); void download(); }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 16, marginTop: 18 }}>
          {fields.map((field) => (
            <label key={field.key} style={{ display: "grid", gap: 7, minWidth: 0 }}>
              <span className="micro-label">{field.label || field.key}</span>
              {field.options ? (
                <select value={patientFields[field.key] || field.options[0]} disabled={busy} style={fieldStyle}
                  onChange={(event) => setPatientFields((previous) => ({ ...previous, [field.key]: event.target.value }))}>
                  {field.options.map((option) => <option key={option} value={option} style={{ color: "#193e35", backgroundColor: "#f6f3ec" }}>{option}</option>)}
                </select>
              ) : (
                <input type={field.type || "text"} value={patientFields[field.key] || ""} disabled={busy}
                  placeholder={field.placeholder} maxLength={field.type ? undefined : 80}
                  min={field.type === "number" ? 0 : undefined} max={field.type === "number" ? 130 : undefined}
                  step={field.type === "number" ? 1 : undefined} style={fieldStyle}
                  onChange={(event) => setPatientFields((previous) => ({ ...previous, [field.key]: event.target.value }))} />
              )}
            </label>
          ))}
        </div>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18 }}>
          <input type="checkbox" checked={authorized} disabled={busy} required onChange={(event) => setAuthorized(event.target.checked)} />
          <span>I confirm these details and images are authorized and de-identified for research demonstration.</span>
        </label>
        <div style={{ marginTop: 16 }}>
          <button className="button button-primary" type="submit" disabled={busy || !authorized}>
            {busy ? "Generating PDF..." : "Download PDF report"}
          </button>
        </div>
      </form>
      {message && <p role="status" style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
