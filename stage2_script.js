const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
         PageBreak, WidthType, ShadingType, BorderStyle, HeadingLevel, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 } // 11pt default
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F497D" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E5C8A" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
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
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: {
          width: 12240,   // US Letter width
          height: 15840   // US Letter height
        },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch
      }
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 80 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Stage 2 — LuaU Code Aesthetic & Typography",
            bold: true,
            size: 36,
            color: "1F497D"
          })
        ]
      }),

      // Subtitle
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: "Weld Landing Page Overhaul Series",
            size: 24,
            color: "44546A",
            italic: true
          })
        ]
      }),

      // Overview heading
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Overview")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: "Stage 2 transforms how text and code look on the page. The current boot sequence lines read like a generic CLI tool. The \"How It Works\" command steps look like terminal output. Neither signals \"Roblox Studio\" to a Roblox developer. This stage makes those elements look exactly like the tools developers already live inside: the Roblox Studio Output window, the Script editor, and the Explorer tree panel."
          })
        ]
      }),

      // Problem heading
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("The Problem with Current Typography")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Boot sequence lines are just monospace text with letter-spacing—they could be from any dark SaaS tool")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("The \"How It Works\" command blocks look like bash terminal output, not Luau code")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("There is no visual language in the type system that says \"this is a Roblox creator tool\"")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Information density is too low—Roblox Studio UI is compact and dense; the current page feels airy and startup-y")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The shimmer animation on every CTA button cheapens the aesthetic—it's a Webflow template trick")]
      }),

      // Change 1
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Change 1: The LuaU Code Block Component")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "The three command steps in \"How It Works\" currently show terminal-style strings. These must be replaced with a proper LuaU code block component that syntax-highlights like a real Luau script editor."
          })
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Component Specifications")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Background: #0d1117 (darker than page bg, like the script editor tab background)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Font: JetBrains Mono or Fira Code (monospace, same family as Studio's script editor)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Tab bar at the top with fake script names: weld_auth.luau, weld_profile.luau, weld_discover.luau")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Active tab has a bottom border in --studio-blue")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Line numbers in the left gutter (grey, like Studio)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Syntax coloring using the Stage 1 LuaU palette")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Syntax Color Palette")]
      }),

      // Syntax table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 2340, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Token Type", bold: true })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3510, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Color", bold: true })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3510, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Examples", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Keywords")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#c792ea")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("local, function, end, return, if, then")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Strings")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#f78c6c")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("\"Scripter\", \"45 R$/hr\"")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Function Names")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#82aaff")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("WeldProfile.build, verify, discover")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Numbers")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#f07178")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("45, 17.3")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Comments")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#546e7a")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("-- PROOF_VERIFIED ")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2340, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Variables")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#c3e88d")] })] }),
              new TableCell({ borders, width: { size: 3510, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("dev, profile, result")] })] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Example LuaU Code")]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "-- weld_auth.luau", color: "546e7a", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "local WeldProfile = {}", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: " ", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "function WeldProfile.build(dev)", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: "dev.role = \"Scripter\"", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: "dev.rate = \"45 R$/hr\"", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: "dev.availability = \"Open now\"", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: "return WeldProfile.verify(dev)", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 200 },
        indent: { left: 720 },
        children: [new TextRun({ text: "end -- PROOF_VERIFIED ", color: "FFFFFF", font: "Courier New" })]
      }),

      // Change 2
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Change 2: The Studio Output Panel")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "The hero boot sequence currently looks generic. It should look like the Roblox Studio Output window. Key changes:"
          })
        ]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Add a fake \"Output\" panel header with the Studio-style title bar (dark bar, \"Output\" text left, close X right)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Prefix each line with a bracketed timestamp: [12:04:01.342]")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Color-code by severity using Studio's Output colors")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The final \"READY_FOR_DISCOVERY\" line should be bold teal, like a print() success in Studio")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Output Colors by Severity")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Severity", bold: true })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Color", bold: true })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Usage", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Info")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("White/Light grey")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Status messages")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Success")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#4ec9b0 (Teal)")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Completion messages")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Warning")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#ffb347 (Amber)")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Non-fatal alerts")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Error")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("#f07178 (Red)")] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Error messages")] })] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("New Boot Sequence Format")]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.001]  Booting weld.roster v2.0...", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.120]  Loading developer lane...", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.245]  Scanning shipped work... OK", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.471]  Verified: 17.3M total visits", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.620]  Matching studio filters...", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 200 },
        indent: { left: 720 },
        children: [new TextRun({ text: "[12:04:01.781]  READY_FOR_DISCOVERY", bold: true, color: "4ec9b0", font: "Courier New" })]
      }),

      // Change 3
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Change 3: Explorer Tree Typography for Role Explorer")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "The current role chips (SCRIPTER, UI/UX, VFX, etc.) are flat pills in a row. They should be restructured to look like the Roblox Studio Explorer tree panel."
          })
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Tree Panel Design")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Font: monospace, 11px, tighter line-height")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Each role becomes a \"folder\" node with a arrow indicator")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Clicking expands to show child nodes: role stats, skills as child items")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The active/selected node has a Studio-blue highlight row (full width, like Explorer selection)")]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Tree Structure")]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 720 },
        children: [new TextRun({ text: " Workspace", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: " Scripter          [open now  45 R$/hr]", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 2160 },
        children: [new TextRun({ text: "  LUAU", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 2160 },
        children: [new TextRun({ text: "  OOP", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 2160 },
        children: [new TextRun({ text: "  DATASTORESERVICE", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: " UI / UX           [open this week  35 R$/hr]", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 1440 },
        children: [new TextRun({ text: " VFX               [3 slots open  30 R$/hr]", color: "FFFFFF", font: "Courier New" })]
      }),

      new Paragraph({
        spacing: { after: 200 },
        indent: { left: 1440 },
        children: [new TextRun({ text: " Builder           [sprint lane  25 R$/hr]", color: "FFFFFF", font: "Courier New" })]
      }),

      // Change 4
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Change 4: Information Density & Font Sizing")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Current font sizes are too generous. The page breathes too much for a tool aimed at developers. Proposed changes:"
          })
        ]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Body text: reduce from implied 14–15px to 13px")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Mono text in boot sequence: reduce from 11px to 10px (tighter, denser)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Add a \"compact mode\" variant for the stats section—pack numbers closer together")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Replace the loose section padding with tighter values in key areas")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("The hero profile card metadata should pack more rows in the same space")]
      }),

      // Change 5
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Change 5: Kill the Shimmer, Add Targeted Glow")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "The current .command-button::before has a shimmer animation running at all times. This is a 2019 Webflow template move. Replace with:"
          })
        ]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("No shimmer on idle state")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("On hover only: a clean glow box-shadow using --studio-blue")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("CTA button hover: box-shadow: 0 0 32px rgba(0, 162, 255, 0.45)")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Border color shifts to studio blue on hover instead of just brightening")]
      }),

      // Page break
      new Paragraph({
        pageBreakBefore: true,
        children: [new TextRun("")]
      }),

      // Implementation section
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Implementation Order")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Create a SyntaxBlock component in src/components/SyntaxBlock.tsx")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Update the HOW_COMMANDS rendering in MarketingPage.tsx to use SyntaxBlock")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Update the boot sequence container to add the Output panel header")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Update .terminal-chip styles to Explorer tree layout")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun("Update globals.css to remove shimmer from idle state")]
      }),

      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [new TextRun("Add targeted glow CSS for hover states")]
      }),

      // Effort section
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Effort & Impact")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Estimated implementation time: 3–5 hours. Files changed: globals.css, MarketingPage.tsx (2 sections), new SyntaxBlock component. This stage is where Roblox developers first feel \"they get us.\""
          })
        ]
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("Key Metrics")]
      }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })]
              }),
              new TableCell({
                borders,
                width: { size: 4680, type: WidthType.DXA },
                shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Estimated Implementation Time")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("3–5 hours")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Files Modified")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("3 (globals.css, MarketingPage.tsx, SyntaxBlock.tsx)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Components Created")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("1 (SyntaxBlock)")] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Impact")] })] }),
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun("Developer alignment—signals \"this tool speaks our language\"")] })] })
            ]
          })
        ]
      }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("")] }),

      // Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Summary")]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "Stage 2 moves Weld beyond a generic dark SaaS aesthetic into a cohesive visual system rooted in Roblox's own development tools. By adopting the typography, code styling, and UI patterns that Roblox developers see every day in Studio, we communicate that Weld is built \"for us, by us.\" The changes are surgical but high-impact: three new components, two CSS updates, and tighter information density transform the page from aspirational startup pitch to credible developer platform."
          })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:\\Users\\cubit\\Downloads\\Weld-app\\stage2_typography.docx", buffer);
  console.log("Document created: C:\\Users\\cubit\\Downloads\\Weld-app\\stage2_typography.docx");
});
