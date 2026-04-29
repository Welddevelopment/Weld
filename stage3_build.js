const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, WidthType, ShadingType, BorderStyle,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const contentWidth = 9360;

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
      // Title Page
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

      // Overview
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Overview")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Stage 3 is where the page stops feeling like a document and starts feeling like a living tool. The current codebase has CSS keyframes and animation utilities but they don't land effectively. This stage rebuilds the animation system from idle to interactive.")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Focus areas: "), new TextRun({ text: "Boot Feel", bold: true }), new TextRun(" (Studio launching), "), new TextRun({ text: "Breathing", bold: true }), new TextRun(" (in-game viewport), and "), new TextRun({ text: "Compile Snap", bold: true }), new TextRun(" (code executing).")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("This is the highest visual impact stage—when complete, the page feels alive for the first time.")] }),

      // Three Principles
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("The Three Animation Principles")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 1: Boot Feel")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("Every Roblox developer knows the Studio boot screen. Files load. Scripts compile. The viewport initialises. The Weld hero should feel the same—not a marketing page loading, but a tool booting.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Implementation Timeline:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 0 (0ms): Page is black. Only the Weld logo mark visible, centered, at 60% opacity")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 1 (80ms): Single-frame white flash (like a CRT switching on) - opacity pulse 0-1-0 on overlay div")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 2 (200ms): Header slides down from y:-20 with backdrop-blur materialising")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 3 (300ms-800ms): Boot sequence lines type one by one with blinking cursor")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 4 (900ms): Profile card rotates in from x:-40px with perspective tilt")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun("Frame 5 (1100ms): CTA button pulses with studio-blue glow to signal readiness")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "Required CSS keyframes: ", bold: true }), new TextRun("boot-flash, header-enter, profile-enter, cta-ready-pulse")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 2: Breathing")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("The page should feel alive while idle. Not distracting - alive. Like a game running in the background.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Key Components:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Particle Field Canvas: ", bold: true }), new TextRun("Small dots (2-3px) drifting at 0.3-0.8px/frame, color cycling between #00a2ff20 and #c792ea20. ~80 particles CPU-friendly pool. No DOM elements.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Hero Profile 3D Tilt: ", bold: true }), new TextRun("Subtle tilt following mouse cursor. CSS perspective(800px) with JS mousemove. Max 8deg X, 5deg Y. Smoothed lerp at 0.08 factor.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun({ text: "Animated Counter Loop: ", bold: true }), new TextRun("Profile stat numbers count up from 0 over 1.2 seconds when profile rotates every 6800ms.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Principle 3: Compile Snap")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun("User interactions respond with sharp, brief, satisfying energy—like a script compiling.")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Interaction Responses:", bold: true })] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Role Chip Click: ", bold: true }), new TextRun("Selected chip brightens. Surrounding chips dim to 30% with 80ms staggered delay. Profile card data scrambles over 120ms. Green compile flash on chip dock (2px border-bottom pulse).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "CTA Button Hover: ", bold: true }), new TextRun("3-stage charge: (1) glow builds 200ms, (2) shimmer sweeps left-to-right, (3) scale(1.03) translateY(-2px). On click: scale snaps to 0.97 for 80ms then releases.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun({ text: "Email Input Focus: ", bold: true }), new TextRun("Border transitions from rgba(255,255,255,0.12) to studio-blue over 200ms. Blue glow appears. Prompt text brightens.")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // Scroll Animations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Scroll-Driven Animations")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("Each landing page section receives tailored scroll animations reinforcing the Roblox Studio aesthetic.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Discord Chaos Section")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Current: ", italics: true }), new TextRun("Generic fade-up")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Discord panel slides LEFT. Weld compiled panel slides RIGHT with 200ms delay. Flash at intersection—compilation complete.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Role Explorer Section")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Current: ", italics: true }), new TextRun("Static on scroll")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Expands downward like opening folder. Rows stagger in 40ms delays. Indent lines draw top-to-bottom with clip-path animation.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How It Works Section")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Current: ", italics: true }), new TextRun("Static code blocks")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Code blocks type line-by-line using typeLine utility. Tab bar appears first, then code types below. Summary fades in on completion.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Stats Section")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Current: ", italics: true }), new TextRun("Static numbers")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Numbers count up from 0 on viewport entry via IntersectionObserver triggering animateNumber().")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Referral Rewards Section")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Current: ", italics: true }), new TextRun("Basic card reveal")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Cards unlock sequentially. Each drops from y:20 with scale(0.95) to scale(1) pop, 150ms stagger. Pulsing green border animation (2s loop).")] }),

      // Utilities Table
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("New Animation Utilities")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("Utilities required for Stage 3 implementation:")] }),

      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [2340, 1170, 4080, 1770],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Utility Name", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] })
            ]
          }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("bootSequence()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS function")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Orchestrates page-load boot with 6-frame timeline")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New", bold: true, color: "C55A11" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("ParticleCanvas")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("React component")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Canvas particle field with 80 drifting dots, color cycling")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New", bold: true, color: "C55A11" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("tiltCard()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS function")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Mouse-follow 3D tilt with perspective, max 8deg X/Y")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New", bold: true, color: "C55A11" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("compileFlash()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS function")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Chip dock compile flash (2px border-bottom pulse)")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New", bold: true, color: "C55A11" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("typeCodeBlock()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS function")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Types code blocks line-by-line leveraging typeLine")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Partial", bold: true, color: "ED7D31" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("animateNumber()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS function")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Counts stat numbers up; needs IntersectionObserver wiring")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Exists", bold: true, color: "70AD47" })] })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("lerpValue()")] })] }),
            new TableCell({ borders, width: { size: 1170, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("JS util")] })] }),
            new TableCell({ borders, width: { size: 4080, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun("Smooth lerp for tilt rotation (0.08 factor)")] })] }),
            new TableCell({ borders, width: { size: 1770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New", bold: true, color: "C55A11" })] })] })
          ] })
        ]
      }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Implementation
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Implementation Wiring Plan")] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun("File updates and integration with MarketingPage.tsx hooks:")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("useEffect Hook Updates")] }),
      new Paragraph({ spacing: { after: 160 },
        children: [new TextRun({ text: "MarketingPage.tsx", bold: true }), new TextRun(" requires 5-6 useEffect updates:")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Boot Sequence: ", bold: true }), new TextRun("Trigger bootSequence() on mount. Orchestrate 6-frame timeline.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Particle Canvas: ", bold: true }), new TextRun("Instantiate ParticleCanvas on mount. Cleanup on unmount.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Tilt Card: ", bold: true }), new TextRun("Attach mousemove listener. Calculate tilt angles. Smooth with lerpValue().")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Role Chip Interaction: ", bold: true }), new TextRun("Wire onClick. Trigger compileFlash(), scramble stats, dim chips.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Animated Numbers: ", bold: true }), new TextRun("Create IntersectionObserver. Trigger animateNumber() on entry.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun({ text: "Scroll-Driven Reveals: ", bold: true }), new TextRun("Wire scroll listener. Trigger typeCodeBlock(), slides, unlocks.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Files to Create/Modify")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("globals.css: Add ~50 lines keyframe definitions")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("animation-utils.ts: New file, ~200 lines")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("ParticleCanvas.tsx: New component, ~150 lines")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun("MarketingPage.tsx: 4 new refs, 5-6 useEffect updates")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // Performance
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Performance & Accessibility")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Performance Requirements")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Target: 60 fps on mid-range devices")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Vanilla CSS + requestAnimationFrame only. No GSAP.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Particle canvas: max 80 particles. Destroyed on mobile (<768px).")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun("will-change used sparingly on performance-critical elements only.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Accessibility")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("All animations respect prefers-reduced-motion using existing utility.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Breathing animations are subtle. Interaction snaps are brief.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
        children: [new TextRun("Test with Windows High Contrast mode.")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Effort & Impact")] }),
      new Paragraph({ spacing: { after: 80 },
        children: [new TextRun({ text: "Estimated Time: ", bold: true }), new TextRun("8-12 hours")] }),
      new Paragraph({ spacing: { after: 160 },
        children: [new TextRun({ text: "Visual Impact: ", bold: true }), new TextRun("HIGHEST of all stages")] }),
      new Paragraph({ spacing: { after: 240 },
        children: [new TextRun("When Stage 3 completes, the Weld landing page transforms from a static site into a dynamic, responsive tool mirroring Roblox Studio. Every interaction feels snappy. Every scroll reveal serves the narrative. The page breathes with idle energy and snaps with user intent. This stage changes perception: no longer a website. An experience.")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outputPath = "/sessions/keen-friendly-lovelace/mnt/Weld-app/stage3_animations.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("Document created at " + outputPath);
});
