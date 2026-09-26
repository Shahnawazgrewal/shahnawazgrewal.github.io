# Paper teaser figures

One WebP per paper, shown in the teaser slot on the home page and the
publications page. A paper with no file here falls back to a typographic venue
plate, so the layout stays intact either way.

## Adding or replacing one

Drop an image in this folder and point the paper's BibTeX entry at it:

```bibtex
figure = {images/papers/my-paper.webp}
```

Roughly 1.69:1 landscape (the slot is 176x104 CSS px; 700px wide covers 3x
displays), cropped to what reads at thumbnail size. Images are `object-fit: cover`.

## Provenance

Each figure below was cropped from the paper's own arXiv PDF — the region above
its "Figure N" caption — then white-padded to the teaser aspect. These are the
authors' own figures, not redrawn or reconstructed.

| File | Paper | Source |
|---|---|---|
| `arshad2019ner.webp` | Aiding Intra-Text Representations with Visual Context for Multim… | arXiv:1904.01356 |
| `breiteneder2026robust.webp` | Robust Harmful Meme Detection under Missing Modalities via Share… | arXiv |
| `calefati2018gitloss.webp` | Git Loss for Deep Face Recognition | arXiv:1807.08512 |
| `essl2026sbbevfusion.webp` | SB-BEVFusion: Enhancing the Robustness against Sensor Malfunctio… | arXiv |
| `ganhoer2024coldstart.webp` | A Multimodal Single-Branch Embedding Network for Recommendation … | arXiv |
| `hannan2025lightweight.webp` | An Effective Training Framework for Light-Weight Automatic Speec… | arXiv |
| `hannan2025paeff.webp` | PAEFF: Precise Alignment and Enhanced Gated Feature Fusion for F… | arXiv |
| `hannan2026dld.webp` | Distillation-Based Layer Dropping (DLD): Effective End-to-End Fr… | arXiv |
| `javaid2026waste.webp` | Towards Effective Waste Segmentation for Automated Waste Recycli… | arXiv |
| `khan2024spoofing.webp` | Frame-to-Utterance Convergence: A Spectra-Temporal Approach for … | arXiv |
| `moscati2025parameter.webp` | Parameter-Efficient Single Collaborative Branch for Recommendati… | arXiv |
| `moscati2026inductivebias.webp` | Face-Voice Association with Inductive Bias for Maximum Class Sep… | arXiv |
| `nawaz2019latent.webp` | Deep Latent Space Learning for Cross-Modal Mapping of Audio and … | arXiv:1909.08685 |
| `nawaz2019semantic.webp` | Do Cross-Modal Systems Leverage Semantic Relationships? | arXiv:1909.01976 |
| `nawaz2021multilingual.webp` | Cross-Modal Speaker Verification and Recognition: A Multilingual… | arXiv:2004.13780 |
| `nawaz2022zsl.webp` | Semantically Grounded Visual Embeddings for Zero-Shot Learning | arXiv:2201.00577 |
| `popattia2022captioning.webp` | Guiding Attention Using Partial-Order Relationships for Image Ca… | arXiv:2204.07476 |
| `saeed2022fop.webp` | Fusion and Orthogonal Projection for Improved Face-Voice Associa… | arXiv |
| `saeed2023singlebranch.webp` | Single-Branch Network for Multimodal Training | arXiv |
| `tu2023dctm.webp` | DCTM: Dilated Convolutional Transformer Model for Multimodal Eng… | arXiv |
| `wang2026memes.webp` | From Native Memes to Global Moderation: Cross-Cultural Evaluatio… | arXiv |

## Papers without a figure (7)

These fall back to a venue plate. Supply an image and add a `figure = {...}`
line to switch any of them over.

| Key | Paper | Why |
|---|---|---|
| gallo2017multimodal | Multimodal Classification Fusion in Real-World Scenarios | not on arXiv |
| ganhoer2025tors | Single-Branch Network Architectures to Close the Modality Gap in… | on arXiv, but no figure caption found in the first 6 pages |
| nawaz2023explainable | Explainable Machine Learning for Diffraction Patterns | not on arXiv |
| rahmani2023datareduction | Data Reduction for X-Ray Serial Crystallography Using Machine Le… | not on arXiv |
| rahmani2024descriptor | Robust Image Descriptor for Machine Learning Based Data Reductio… | not on arXiv |
| saeed2024fame | A Synopsis of FAME 2024 Challenge: Associating Faces with Voices… | not on arXiv |
| zafar2024restoration | Single Stage Adaptive Multi-Attention Network for Image Restorat… | not on arXiv |
