# materials/ — source material for the Teacher Agent (NOT deployed)

This folder lives at the **repo root, outside `synthesis/`**, which is the
Firebase Hosting root. `firebase deploy` runs from `synthesis/`, so nothing in
here is ever served on the public website — it's safe for exam banks, teacher
texts, and other authoring input.

## Where to drop things

```
materials/
  ekthesi/       ← Έκθεση / Νεοελληνική Γλώσσα (start here)
  logotexnia/    ← Λογοτεχνία
  archaia/       ← Αρχαία
```

Drop the PDF (or a text file) into the matching subfolder and commit it to the
`claude/teacher-agent-assignments` branch. Official Τράπεζα Θεμάτων material is
public IEP content; keep any personal/copyrighted texts to what you're
comfortable committing.

Naming hint that helps the agent: include grade + profile in the filename, e.g.
`ekthesi/B-lykeiou_trapeza_2024.pdf` or `ekthesi/mock_panellinies_sample.pdf`.
