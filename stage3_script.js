const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, WidthType, ShadingType, BorderStyle,
        LevelFormat, PageBreak, VerticalAlign } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const contentWidth = 9360; // US Letter with 1" margins

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E78" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "44546A" },
        paragraph: { spacing: { before: 120, after: 80 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 }
              }
            }
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "◦",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 1440, hanging: 360 }
              }
            }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: {
          width: 12240,
          height: 15840
        },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title Page
      new Paragraph({
        children: [new TextRun("")]
      }),
      new Paragraph({
        spacing: { before: 1200 },
        children: [new TextRun("")]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Stage 3 — Animation System Rebuild",
          bold: true,
          size: 48,
          color: "1F4E78"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({
          text: "Weld Landing Page Overhaul Series",
          size: 28,
          color: "2E75B6"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Technical Specification Document",
          italics: true,
          size: 24,
          color: "44546A"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 0 },
        children: [new TextRun({
          text: "April 2026",
          size: 22,
          color: "666666"
        })]
      }),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Executive Overview
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Overview")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Stage 3 is where the page stops feeling like a document and starts feeling like a living tool. The current codebase has CSS keyframes and animation utilities—they exist, but they don't land. The boot sequence feels like a fade-in. The scroll reveals feel like every other scroll library. Nothing feels like you're inside Roblox Studio.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("This stage rebuilds the animation system from idle to interactive, focusing on three principles: "), new TextRun({ text: "Boot Feel", bold: true }), new TextRun(" (like Studio launching), "), new TextRun({ text: "Breathing", bold: true }), new TextRun(" (like the viewport in-game), and "), new TextRun({ text: "Compile Snap", bold: true }), new TextRun(" (like code executing).")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("When complete, the page feels alive for the first time. This is the highest visual impact stage of the entire overhaul.")]
      }),

      // Three Animation Principles
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("The Three Animation Principles")]
      }),

      // Principle 1
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Principle 1: Boot Feel")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("Every Roblox developer knows the Studio boot screen. Files load. Scripts compile. The viewport initialises. The Weld hero should feel like that—not a marketing page loading, but a tool booting.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Implementation Timeline:",
          bold: true
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 0 (0ms): Page is black. Only the Weld logo mark visible, centred, at 60% opacity")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 1 (80ms): Single-frame white flash (like a CRT switching on)—opacity pulse 0→1→0 on an overlay div")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 2 (200ms): Header slides down from y:-20 with backdrop-blur materialising")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 3 (300ms–800ms): Boot sequence lines type one by one with the cursor blinking between lines")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Frame 4 (900ms): Profile card rotates in from x:-40px with a slight perspective tilt")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Frame 5 (1100ms): CTA button pulses once with studio-blue glow to signal readiness")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Required CSS keyframes: ",
          bold: true
        }), new TextRun("boot-flash, header-enter, profile-enter, cta-ready-pulse")]
      }),

      // Principle 2
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Principle 2: Breathing")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("The page should feel alive while idle. Not distracting—alive. Like a game running in the background.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Key Components:",
          bold: true
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "Particle Field Canvas: ",
          bold: true
        }), new TextRun("Small dots (2–3px) drifting at 0.3–0.8px/frame, color cycling between #00a2ff20 and #c792ea20. Canvas sits behind all content at z:-1. ~80 particles. CPU-friendly (requestAnimationFrame with a particle pool, no DOM elements).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "Hero Profile Card 3D Tilt: ",
          bold: true
        }), new TextRun("Subtle 3D tilt following the mouse cursor using CSS perspective(800px) and JS mousemove. Max tilt: 8deg X, 5deg Y. Smoothed with lerp at 0.08 factor.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Animated Counter Loop: ",
          bold: true
        }), new TextRun("Active profile stat numbers run a slow animated counter loop every HERO_ROTATION_MS (6800ms)—counts up from 0 to the value over 1.2 seconds when the profile rotates.")]
      }),

      // Principle 3
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Principle 3: Compile Snap")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun("When the user interacts—clicking a role chip, hovering a card, submitting the form—things should respond with the energy of a script compiling. Sharp, brief, satisfying.")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Interaction Responses:",
          bold: true
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "Role Chip Click: ",
          bold: true
        }), new TextRun("Selected chip instantly brightens. Surrounding chips dim to 30% opacity with an 80ms delay each (outward from selected). The profile card data changes with a 120ms scramble effect on the values. A brief green 'compile flash' (2px border-bottom pulse on the chip dock container).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "CTA Button Hover: ",
          bold: true
        }), new TextRun("3-stage charge effect: (1) glow builds over 200ms, (2) shimmer sweeps left-to-right once, (3) scale(1.03) translateY(-2px). On click: scale snaps to 0.97 for 80ms then releases.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({
          text: "Email Input Focus: ",
          bold: true
        }), new TextRun("Border color transitions from rgba(255,255,255,0.12) to --studio-blue over 200ms. A subtle blue glow appears behind the input. The prompt text before the input ('> claim_beta_invite --email=') brightens.")]
      }),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Scroll-Driven Animations
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Scroll-Driven Animations")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("Each section of the landing page receives tailored scroll animations that reinforce the Roblox Studio aesthetic.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Discord Chaos Section")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Current State: ",
          italics: true
        }), new TextRun("Generic fade-up reveal")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "New Behavior: ",
          bold: true
        }), new TextRun("The Discord panel slides in from the LEFT (like opening a server sidebar). The Weld 'compiled' panel slides in from the RIGHT simultaneously, with a 200ms delay. As they meet, a brief flash occurs at the dividing line—as if the compilation completed at the moment of intersection.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Role Explorer Section")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Current State: ",
          italics: true
        }), new TextRun("Appears on scroll")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "New Behavior: ",
          bold: true
        }), new TextRun("Expands downward like a folder being opened in the Studio Explorer—height animates from 0 using max-height transition. Each child row staggers in with 40ms delays. The indent lines draw from top to bottom with a CSS clip-path animation.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("How It Works Section")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Current State: ",
          italics: true
        }), new TextRun("Static code blocks")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "New Behavior: ",
          bold: true
        }), new TextRun("Each code block types itself as it enters the viewport. Line by line, character by character, using the existing typeLine utility. The tab bar appears first, then the code types below it. Completion triggers the 'summary' text to fade in from the bottom.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Stats Section")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Current State: ",
          italics: true
        }), new TextRun("Static numbers")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "New Behavior: ",
          bold: true
        }), new TextRun("Numbers count up from 0 when entering viewport using the existing animateNumber utility, wired to IntersectionObserver on each stat node.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Referral Rewards Section")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Current State: ",
          italics: true
        }), new TextRun("Cards appear with basic reveal")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "New Behavior: ",
          bold: true
        }), new TextRun("Cards 'unlock' sequentially—each card drops in from y:20 with a scale(0.95)->scale(1) pop, 150ms stagger. Unlocked cards have a pulsing green border animation (2s loop, rgba(78,201,176,0.4) -> transparent).")]
      }),

      // Animation Utilities Table
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("New Animation Utilities")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun("The following utilities must be created or updated to support Stage 3. Below is a comprehensive inventory.")]
      }),

      // Utility Table
      new Table({
        width: { size: contentWidth, type: WidthType.DXA },
        columnWidths: [2340, 1170, 4080, 1770],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({
                  children: [new TextRun({
                    text: "Utility Name",
                    bold: true,
                    color: "FFFFFF"
                  })]
                })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({
                  children: [new TextRun({
                    text: "Type",
                    bold: true,
                    color: "FFFFFF"
                  })]
                })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({
                  children: [new TextRun({
                    text: "Description",
                    bold: true,
                    color: "FFFFFF"
                  })]
                })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({
                  children: [new TextRun({
                    text: "Status",
                    bold: true,
                    color: "FFFFFF"
                  })]
                })]
              })
            ]
          }),
          // Row 1
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("bootSequence()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS function")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Orchestrates page-load boot animation with 6-frame timeline")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "New",
                  bold: true,
                  color: "C55A11"
                })] })]
              })
            ]
          }),
          // Row 2
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("ParticleCanvas")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("React component")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Canvas particle field with 80 drifting dots, color cycling, CPU-friendly")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "New",
                  bold: true,
                  color: "C55A11"
                })] })]
              })
            ]
          }),
          // Row 3
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("tiltCard()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS function")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Mouse-follow 3D tilt with perspective(800px), max 8deg X, 5deg Y")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "New",
                  bold: true,
                  color: "C55A11"
                })] })]
              })
            ]
          }),
          // Row 4
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("compileFlash()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS function")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Chip dock compile flash (2px border-bottom pulse)")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "New",
                  bold: true,
                  color: "C55A11"
                })] })]
              })
            ]
          }),
          // Row 5
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("typeCodeBlock()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS function")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Types code blocks line-by-line on scroll; leverages typeLine")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "Partial",
                  bold: true,
                  color: "ED7D31"
                })] })]
              })
            ]
          }),
          // Row 6
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("animateNumber()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS function")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Counts stat numbers up from 0; needs IntersectionObserver wiring")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "Exists",
                  bold: true,
                  color: "70AD47"
                })] })]
              })
            ]
          }),
          // Row 7
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("lerpValue()")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1170, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("JS util")] })]
              }),
              new TableCell({
                borders,
                width: { size: 4080, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Smooth lerp for tilt card rotation (0.08 factor)")] })]
              }),
              new TableCell({
                borders,
                width: { size: 1770, type: WidthType.DXA },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({
                  text: "New",
                  bold: true,
                  color: "C55A11"
                })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun("")] }),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Wiring Plan
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Implementation Wiring Plan")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("This section details which files require updates and how the new animation utilities integrate with existing MarketingPage.tsx hooks.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("useEffect Hook Updates")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: "MarketingPage.tsx",
          bold: true
        }), new TextRun(" requires 5–6 useEffect hook updates:")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "useEffect (Boot Sequence): ",
          bold: true
        }), new TextRun("Trigger bootSequence() on component mount. Orchestrate 6-frame timeline with proper ref targeting (bootSequenceRef).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "useEffect (Particle Canvas): ",
          bold: true
        }), new TextRun("Instantiate ParticleCanvas component ref on mount. Cleanup on unmount to prevent memory leaks.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "useEffect (Tilt Card): ",
          bold: true
        }), new TextRun("Attach mousemove listener to tiltCardRef. Calculate tilt angles using mouse position relative to card center. Smooth with lerpValue().")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "useEffect (Role Chip Interaction): ",
          bold: true
        }), new TextRun("Wire onClick handlers to role chips. On click: trigger compileFlash(), scramble stats with scrambleText(), dim surrounding chips with staggered delays.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({
          text: "useEffect (Animated Numbers): ",
          bold: true
        }), new TextRun("Create IntersectionObserver for each stat element. Trigger animateNumber() when stat enters viewport.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun({
          text: "useEffect (Scroll-Driven Reveals): ",
          bold: true
        }), new TextRun("Wire scroll listener to detect section-in-viewport. Trigger typeCodeBlock(), slide animations, and unlock card sequencing.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Refs to Create")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("bootSequenceRef: DOM reference to the hero section container")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("particleCanvasRef: Ref to the ParticleCanvas component instance")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("tiltCardRef: DOM reference to the profile card for mouse-follow tilt")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("chipDockRef: DOM reference to the chip selection dock for compile flash")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("statsRef: Array of refs, one per stat number element")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Files to Create or Modify")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("globals.css: Add new CSS keyframes (boot-flash, header-enter, profile-enter, cta-ready-pulse, particle drift, etc.)")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("animation-utils.ts: New file containing bootSequence(), tiltCard(), compileFlash(), lerpValue(), and helper functions")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("ParticleCanvas.tsx: New React component for background particle animation")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("MarketingPage.tsx: Update 5–6 useEffect hooks and add 4 new refs")]
      }),

      // Page Break
      new Paragraph({ children: [new PageBreak()] }),

      // Performance & Validation
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Performance Budget")]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun("All animations must be performant and accessible. Strict constraints ensure the page remains responsive on mid-range devices.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Performance Requirements")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Target: 60 fps on mid-range devices")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("No GSAP or heavy animation libraries. Vanilla CSS + requestAnimationFrame only.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Particle canvas max 80 particles. Destroyed on mobile viewports (<768px).")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Use will-change: transform sparingly on performance-critical elements only.")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Accessibility")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("All animations must respect prefers-reduced-motion. Use existing prefersReducedMotion() utility in codebase.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Animations should not distract from content. Idle breathing is subtle; interaction snap is brief.")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Test with Windows High Contrast mode to ensure animations remain visible.")]
      }),

      // Effort & Timeline
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Effort & Timeline")]
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Estimated Implementation Time: ",
          bold: true
        }), new TextRun("8–12 hours")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({
          text: "Visual Impact: ",
          bold: true
        }), new TextRun("HIGHEST of all overhaul stages")]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({
          text: "Files Affected:",
          bold: true
        })]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("globals.css: Add ~50 lines of keyframe definitions")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("MarketingPage.tsx: Add 4 new refs, update 5–6 useEffect hooks, wire event handlers")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("animation-utils.ts: New file, ~200 lines")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("ParticleCanvas.tsx: New component, ~150 lines")]
      }),

      new Paragraph({
        spacing: { before: 120, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
        children: [new TextRun("")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Completion Milestone")]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun("When Stage 3 is complete, the Weld landing page will transform from a static marketing site into a dynamic, responsive tool that mirrors the Roblox Studio experience. Every interaction feels snappy. Every scroll reveal serves the narrative. The page breathes with idle energy and snaps with user intent.")]
      }),
      new Paragraph({
        spacing: { after: 0 },
        children: [new TextRun("This is the stage that changes perception. No longer a website. An experience.")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:\\Users\\cubit\\Downloads\\Weld-app\\stage3_animations.docx", buffer);
  console.log("Document created successfully at C:\\Users\\cubit\\Downloads\\Weld-app\\stage3_animations.docx");
});
