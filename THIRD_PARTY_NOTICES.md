# Third-party notices and release permissions

This document distinguishes original source-code licensing from the rights attached to external materials. It is a release-preparation notice, not a complete dependency or copyright audit. Listing an asset here does not establish permission to distribute it.

## Original project code

The root MIT license is intended for original source code and original documentation that their copyright holders are entitled to license. Before publishing the license, confirm the consent of all relevant contributors and any applicable institutional, sponsor or competition terms. Retain copyright and license notices for any incorporated third-party code.

## Training data and model artifacts

| Material | Known provenance / status | Release consideration |
| :--- | :--- | :--- |
| APTOS 2019 Blindness Detection | Referenced in `train.py`; data access is subject to Kaggle competition rules, including non-commercial and academic research use conditions. | Obtain data from the original authorized source and comply with its terms. Do not assume permission to republish images or labels or to use them commercially. |
| `models/efficientnet_b0_best.pth` | Saved model checkpoint used by the backend. Full training-data and initialization provenance not independently verified. | Outside the MIT grant. Verify all relevant training-data, pretrained-weight and checkpoint redistribution terms with the rights holders. |
| `models/efficientnet_b0_mini.pth` | Additional saved model checkpoint; complete provenance not independently verified. | Outside the MIT grant. Verify applicable redistribution terms separately. |
| `district_shapes/` | Geospatial files; source and license not established in this review. | Confirm source, attribution obligations, boundary-data terms and redistribution rights. |
| `planning_data.csv` and frontend planning assets | Project planning inputs; underlying source rights not independently verified. | Confirm data provenance, attribution and redistribution permissions. |

Original data access and rules:
- https://www.kaggle.com/competitions/aptos2019-blindness-detection/data
- https://www.kaggle.com/competitions/aptos2019-blindness-detection/rules

The APTOS data-use conditions do not, by themselves, establish the legal status of all derived model weights. The checkpoint rights require their own review. The repository being publicly visible is not evidence of a valid redistribution grant.

## Software dependencies

The project uses third-party dependencies including Next.js, React, Tailwind CSS, Motion, Lenis, FastAPI, Uvicorn, PyTorch, torchvision, timm, OpenCV, NumPy, Pillow, Grad-CAM and ReportLab. Each dependency remains governed by its own upstream license, including applicable notices and conditions. This project license does not replace those licenses. Check the exact installed dependency versions and their transitive dependencies before distributing a combined application or container.

## Research and clinical limitations

The project is a research and demonstration prototype. It has not been established as a clinically validated medical device. Use only authorized, de-identified demonstration images; do not share identifiable patient information, secrets or restricted records in the repository, issue tracker or public deployment. Model scores and explanations require qualified professional review.

## Release readiness checklist

- [ ] Confirm original code copyright ownership and contributor approval for MIT licensing.
- [ ] Confirm applicable institutional, sponsor and competition terms.
- [ ] Record the provenance and redistribution permissions for both model checkpoints.
- [ ] Identify source and license for district shapefiles and planning datasets.
- [ ] Audit direct and transitive dependency notices and any incorporated external assets.
- [ ] Confirm no credentials, identifiable patient data or unauthorized data are tracked, including in repository history.

Until these checks are complete, describe the release as a public research demonstration with a proposed or separately confirmed source-code license; do not represent all repository artifacts as unrestricted open-source or commercially reusable materials.
