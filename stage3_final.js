const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, WidthType, ShadingType, BorderStyle,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const contentWidth = 9360;

function createTableCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun(text)] })]
  });
}

function createTableCellBold(text, width, color) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text, bold: true, color: color })] })]
  });
}

function createHeaderCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "2E75B6", type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text, bold: true, color: "FFFFFF" })] })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E78" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
      ]}
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({ spacing: { before: 1200 }, children: [new TextRun("")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Stage 3 — Animation System Rebuild", bold: true, size: 48, color: "1F4E78" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
        children: [new TextRun({ text: "Weld Landing Page Overhaul Series", size: 28, color: "2E75B6" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
        children: [new TextRun({ text: "Technical Specification Document", italics: true, size: 24, color: "44546A" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 0 },
        children: [new TextRun({ text: "April 2026", size: 22, color: "666666" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Overview")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Stage 3 is where the page stops feeling like a document and starts feeling like a living tool. The current codebase has CSS keyframes and animation utilities but they don't land effectively. This stage rebuilds the animation system from idle to interactive.")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Focus areas: "), new TextRun({ text: "Boot Feel", bold: true }), new TextRun(" (Studio launching), "), new TextRun({ text: "Breathing", bold: true }), new TextRun(" (in-game viewport), and "), new TextRun({ text: "Compile Snap", bold: true }), new TextRun(" (code executing).")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("This is the highest visual impact stage—when complete, the page feels alive for the first time.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Three Animation Principles")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 1: Boot Feel")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Every Roblox developer knows the Studio boot screen. Files load. Scripts compile. The viewport initialises. The Weld hero should feel the same—not a marketing page loading, but a tool booting. The sequence unfolds over 1.1 seconds.")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Timeline:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Frame 0 (0ms): Black page with logo at 60% opacity")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Frame 1 (80ms): Single white flash like CRT switch-on")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Frame 2 (200ms): Header slides down with backdrop-blur")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Frame 3 (300-800ms): Boot lines type with cursor blink")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Frame 4 (900ms): Profile card rotates in with perspective")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Frame 5 (1100ms): CTA button pulses with blue glow")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 2: Breathing")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("The page feels alive while idle—subtle, not distracting. Like a game running in the background.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Particle Field Canvas: ", bold: true }), new TextRun("80 small dots (2-3px) drifting at 0.3-0.8px/frame. Color cycling between two blues. CPU-friendly requestAnimationFrame pool.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "3D Tilt Following: ", bold: true }), new TextRun("Profile card tilts subtly based on mouse position. CSS perspective(800px), max 8deg rotation, smoothed with 0.08 lerp factor.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Counter Animation: ", bold: true }), new TextRun("Stat numbers count from 0 to target over 1.2 seconds when profile rotates every 6800ms.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 3: Compile Snap")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Interactions respond with sharp, brief energy—like code compiling. Instant feedback on all user actions.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Role Chip Clicks: ", bold: true }), new TextRun("Selected chip brightens. Others dim to 30% with staggered 80ms delays. Profile stats scramble 120ms. Green compile flash on dock.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Button Hover: ", bold: true }), new TextRun("3-stage: glow builds 200ms, shimmer sweeps, scale(1.03) rise. On click: snap to 0.97 for 80ms.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Input Focus: ", bold: true }), new TextRun("Border transitions to blue 200ms. Blue glow appears. Prompt text brightens.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Scroll-Driven Animations")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Each section gets tailored animations reinforcing the Studio aesthetic.")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Discord & Role Explorer")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("Discord panel slides LEFT, Weld panel slides RIGHT with 200ms delay. Flash at intersection. Role Explorer expands downward like opening folder. Rows stagger 40ms delays.")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How It Works & Stats")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun("Code blocks type line-by-line using typeLine utility. Stats count up on viewport entry via IntersectionObserver.")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Referral Rewards")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Cards unlock sequentially with scale(0.95) to scale(1) pop, 150ms stagger. Pulsing green border loop on unlocked cards.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("New Animation Utilities")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("Seven utilities needed for Stage 3:")] }),

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [2340, 1170, 4080, 1770],
        rows: [
          new TableRow({ children: [
            createHeaderCell("Utility Name", 2340),
            createHeaderCell("Type", 1170),
            createHeaderCell("Description", 4080),
            createHeaderCell("Status", 1770)
          ] }),
          new TableRow({ children: [
            createTableCell("bootSequence()", 2340),
            createTableCell("JS function", 1170),
            createTableCell("Orchestrates 6-frame boot timeline", 4080),
            createTableCellBold("New", 1770, "C55A11")
          ] }),
          new TableRow({ children: [
            createTableCell("ParticleCanvas", 2340),
            createTableCell("React component", 1170),
            createTableCell("Canvas with 80 drifting particles, color cycling", 4080),
            createTableCellBold("New", 1770, "C55A11")
          ] }),
          new TableRow({ children: [
            createTableCell("tiltCard()", 2340),
            createTableCell("JS function", 1170),
            createTableCell("Mouse-follow 3D tilt, max 8deg rotation", 4080),
            createTableCellBold("New", 1770, "C55A11")
          ] }),
          new TableRow({ children: [
            createTableCell("compileFlash()", 2340),
            createTableCell("JS function", 1170),
            createTableCell("Chip dock flash animation", 4080),
            createTableCellBold("New", 1770, "C55A11")
          ] }),
          new TableRow({ children: [
            createTableCell("typeCodeBlock()", 2340),
            createTableCell("JS function", 1170),
            createTableCell("Types code line-by-line on scroll", 4080),
            createTableCellBold("Partial", 1770, "ED7D31")
          ] }),
          new TableRow({ children: [
            createTableCell("animateNumber()", 2340),
            createTableCell("JS function", 1170),
            createTableCell("Counts numbers up, needs IntersectionObserver", 4080),
            createTableCellBold("Exists", 1770, "70AD47")
          ] }),
          new TableRow({ children: [
            createTableCell("lerpValue()", 2340),
            createTableCell("JS utility", 1170),
            createTableCell("Smooth lerp for tilt rotation", 4080),
            createTableCellBold("New", 1770, "C55A11")
          ] })
        ]
      }),

      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),
      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation & Performance")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Files Requiring Updates")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("globals.css: ~50 lines new keyframe definitions")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("animation-utils.ts: New file, ~200 lines")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("ParticleCanvas.tsx: New component, ~150 lines")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("MarketingPage.tsx: 4 new refs, 5-6 useEffect updates")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Performance Targets")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("60 fps on mid-range devices")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Vanilla CSS and requestAnimationFrame only—no GSAP")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Max 80 particles, destroyed on mobile (<768px)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("will-change used sparingly")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Accessibility")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Respect prefers-reduced-motion via existing utility")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Subtle breathing, brief snaps—no distraction")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Test with Windows High Contrast mode")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Effort & Impact")] }),
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Estimated Time: ", bold: true }), new TextRun("8-12 hours")] }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Visual Impact: ", bold: true }), new TextRun("HIGHEST—when complete, transforms page from static website into a dynamic, responsive tool that mirrors Roblox Studio. Every interaction feels snappy. Every scroll reveal serves the narrative. The page breathes with idle energy and snaps with user intent. This stage changes perception: no longer a website. An experience.")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outputPath = "/sessions/keen-friendly-lovelace/mnt/Weld-app/stage3_animations.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document created successfully at " + outputPath);
}).catch(err => {
  console.error("Error creating document:", err);
  process.exit(1);
});
