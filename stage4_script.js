const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign,
        HeadingLevel, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 6, color: "D0D0D0" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 },
        paragraph: { spacing: { line: 360 } }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4788" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E5C8A" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "3E7CB8" },
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
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // TITLE PAGE
        new Paragraph({ children: [new TextRun("")], spacing: { before: 400 } }),
        new Paragraph({ children: [new TextRun("")], spacing: { before: 400 } }),
        new Paragraph({
          text: "Stage 4",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 60 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Section-by-Section Component Overhaul", bold: true, size: 28, color: "1F4788" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Weld Landing Page Overhaul Series", italic: true, size: 24, color: "666666" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "Technical Specification & Implementation Guide", size: 22, color: "666666" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),
        new Paragraph({
          children: [new TextRun({ text: "April 2026", size: 20, color: "999999" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // PAGE BREAK
        new Paragraph({ children: [new PageBreak()] }),

        // OVERVIEW SECTION
        new Paragraph({ text: "Overview", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ children: [new TextRun("Stage 4 is the most substantial visual redesign in the Weld landing page overhaul series. Where Stages 1-3 changed system-level aesthetics (colors, typography, and motion), Stage 4 performs a deep visual redesign of each individual section using a specific Roblox-native UI metaphor.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun("Every section of the landing page is mapped to a recognisable element of the Roblox ecosystem: Studio, Discord, the Explorer, the Properties panel. This design approach makes the page feel like it was built from inside the tools that Roblox developers already live in daily, creating immediate familiarity and trust.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun("Each section redesign is a contained component change that can be shipped independently. The recommended implementation order (bottom of this document) prioritizes sections with the highest visual impact and developer resonance.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // METAPHOR MAP
        new Paragraph({ text: "The Metaphor Map", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun("Each landing page section is mapped to a Roblox UI element. The table below shows the current look, new metaphor, and inspiration source for every component redesign.")], spacing: { after: 180 } }),

        // METAPHOR TABLE - build table rows
        (() => {
          const rows = [];
          // Header row
          rows.push(new TableRow({
            children: [
              new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "1F4788", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Section", bold: true, color: "FFFFFF" })], alignment: AlignmentType.LEFT })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F4788", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Current Look", bold: true, color: "FFFFFF" })], alignment: AlignmentType.LEFT })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F4788", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "New Metaphor", bold: true, color: "FFFFFF" })], alignment: AlignmentType.LEFT })] }),
              new TableCell({ borders, width: { size: 2560, type: WidthType.DXA }, shading: { fill: "1F4788", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: "Inspiration Source", bold: true, color: "FFFFFF" })], alignment: AlignmentType.LEFT })] })
            ]
          }));

          // Data rows
          const data = [
            ["Navigation Header", "Dark pill bar with logo and CTA", "Roblox Studio Toolbar", "Studio top toolbar with icon groups"],
            ["Hero Left Panel", "Terminal boot sequence", "Studio Output Window", "Studio Output panel"],
            ["Hero Right Panel", "Rotating profile card", "Studio Properties Inspector", "Studio Properties panel"],
            ["Discord Chaos Section", "Styled div messages", "Real Discord server UI", "discord.com dark theme"],
            ["Role Explorer", "Horizontal chip pills", "Studio Explorer Tree", "Studio Explorer panel"],
            ["How It Works", "Terminal command blocks", "LuaU Script Editor Tabs", "Studio Script tab editor"],
            ["Stats Section", "Plain number grid", "Roblox game server stats", "Roblox game details page"],
            ["Referral Rewards", "Basic reward cards", "Roblox Badge unlock UI", "Roblox badge award modal"],
            ["CTA Section", "Dark email form panel", "Roblox Studio Welcome Screen", "Studio New Project welcome card"],
            ["FAQ", "Simple accordion", "Studio Properties collapsible", "Studio property group collapse"]
          ];

          data.forEach((row, idx) => {
            const shade = idx % 2 === 0 ? "F5F5F5" : "FFFFFF";
            rows.push(new TableRow({
              children: [
                new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun(row[0])] })] }),
                new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun(row[1])] })] }),
                new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun(row[2])] })] }),
                new TableCell({ borders, width: { size: 2560, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun(row[3])] })] })
              ]
            }));
          });

          return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 2400, 2400, 2560], rows });
        })(),

        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),
        new Paragraph({ children: [new PageBreak()] }),

        // SECTION REDESIGNS
        new Paragraph({ text: "Section Redesigns", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun("The following sections detail the visual redesign for each component on the landing page. Each redesign provides specific implementation guidance including styling directives, element structure, and visual references.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // NAVIGATION HEADER
        new Paragraph({ text: "Navigation Header: Studio Toolbar", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("A rounded pill bar (header-rail class) with the Weld logo, audience toggle in the centre, and a CTA button on the right.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Studio Toolbar Design: ", bold: true }), new TextRun("Remove the rounded pill. The toolbar now spans full width with a flat bottom border, exactly like Studio's toolbar.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Left group: ", bold: true }), new TextRun("Weld logo mark + wordmark (unchanged) | thin vertical divider | MODE toggle as icon+text tab strip")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Centre group: ", bold: true }), new TextRun("Search/filter bar styled like Studio's search box (dark inset, magnifier icon)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Right group: ", bold: true }), new TextRun("Notification bell icon | avatar circle | primary CTA button in Studio blue")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Bottom border: ", bold: true }), new TextRun("1px border in rgba(255,255,255,0.08), no shadow")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // HERO LEFT PANEL
        new Paragraph({ text: "Hero Left Panel: Studio Output Window", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Terminal-rail div with scan overlay and boot lines.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Output Window Design: ", bold: true }), new TextRun("A fake Studio panel chrome with top bar labeled 'Output', X and icons (right, decorative).")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Below the chrome: ", bold: true }), new TextRun("Boot sequence lines formatted as Studio Output")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Filter bar: ", bold: true }), new TextRun("Styled like Studio's Filter Output--filter pills: ALL | PRINT | WARN | ERROR")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Panel styling: ", bold: true }), new TextRun("Dark background (#0d1117) distinct from page background")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Left edge: ", bold: true }), new TextRun("2px colored border matching current audience mode color")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // HERO RIGHT PANEL
        new Paragraph({ text: "Hero Right Panel: Studio Properties Inspector", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Floating profile card with avatar, handle, stats in a card layout.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Properties Inspector Design: ", bold: true }), new TextRun("Panel chrome header reads 'Properties - DeveloperProfile'.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Two-column table: ", bold: true }), new TextRun("Left (label) and right (value). Properties: DisplayName, Role, Rate, Availability, ShippedGames, TotalVisits, Timezone, ResponseTime")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Row shading: ", bold: true }), new TextRun("Alternating subtle row shading (#131726 / #0e111c)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Values: ", bold: true }), new TextRun("Monospace font; verified properties have a small teal checkmark")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Avatar: ", bold: true }), new TextRun("Small 'instance icon' style--small square thumbnail above the panel")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // DISCORD CHAOS SECTION
        new Paragraph({ text: "Discord Chaos Section: Real Discord Dark Mode", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Styled divs that look 'Discord-inspired' but don't pass for the real thing.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New: ", bold: true }), new TextRun("Actually looks like Discord's dark mode.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Panel background: ", bold: true }), new TextRun("Discord's exact dark: #313338")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Message layout: ", bold: true }), new TextRun("Avatar circle (40px) + username + timestamp + message body")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Username colors: ", bold: true }), new TextRun("Discord's role color system--hue-based colours per user")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Sidebar: ", bold: true }), new TextRun("Partially visible on left, showing '#dev-hiring' channel")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Spam/noise: ", bold: true }), new TextRun("Discord's 'This message was blocked' treatment (grey, collapsed)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Deleted messages: ", bold: true }), new TextRun("Show '[Original Message Deleted]' in Discord's exact grey italic style")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Transition: ", bold: true }), new TextRun("Discord panel on left, Weld output on right, separated by glowing compile line")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // PAGE BREAK
        new Paragraph({ children: [new PageBreak()] }),

        // ROLE EXPLORER
        new Paragraph({ text: "Role Explorer: Studio Explorer Tree", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Horizontal pill chips with a card showing role stats.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Studio Explorer Design: ", bold: true }), new TextRun("Full Explorer panel mockup: dark panel, 'Explorer' header with search box.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Hierarchy: ", bold: true }), new TextRun("Workspace > Roles > [role folders]")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Role nodes: ", bold: true }), new TextRun("Folder nodes (closed, open). Children: Rate, Availability, Skills, ShippedWork with appropriate icons")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Icons: ", bold: true }), new TextRun("Studio Explorer's exact icon set style (small 16px icons before each node)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Selection highlight: ", bold: true }), new TextRun("Active/selected role has full-width Studio blue selection highlight")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Scrollbar: ", bold: true }), new TextRun("Dark scrollbar styled like Studio's")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // HOW IT WORKS
        new Paragraph({ text: "How It Works: LuaU Script Editor Tabs", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Three command steps with terminal lines.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Script Editor Design: ", bold: true }), new TextRun("Full script editor mock: tab bar with three script tabs.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Tab bar: ", bold: true }), new TextRun("'weld_auth.luau', 'weld_profile.luau', 'weld_discover.luau'")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Active tab: ", bold: true }), new TextRun("White text, bottom border in studio blue")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Line numbers: ", bold: true }), new TextRun("Left gutter (1-15 lines)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Syntax highlighting: ", bold: true }), new TextRun("Full LuaU syntax highlighting using Stage 1 palette")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Run button: ", bold: true }), new TextRun("Below editor; Studio's green play button aesthetic")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Completion: ", bold: true }), new TextRun("Appears as comment: -- PROOF_VERIFIED")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // FINAL CTA SECTION
        new Paragraph({ text: "Final CTA Section: Studio Welcome Screen", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Current: ", bold: true }), new TextRun("Dark panel with email input.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: "New Welcome Screen Design: ", bold: true }), new TextRun("Mimics Roblox Studio welcome: centred card with Studio blue gradient top.")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Header: ", bold: true }), new TextRun("'Start a New Project' -> 'Start Your Weld Profile'")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Developer path tiles: ", bold: true }), new TextRun("Three option tiles: SCRIPTER, BUILDER, DESIGNER (like Studio's Baseplate/Terrain/Obby)")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Email form: ", bold: true }), new TextRun("Below tiles; styled like Studio's 'Sign in to Roblox Studio' input")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Micro copy: ", bold: true }), new TextRun("'Your shipped work speaks before you do.'")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // IMPLEMENTATION & EFFORT
        new Paragraph({ text: "Implementation Order & Effort", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun("Each section redesign is a contained component change that can be shipped independently. The following order prioritizes sections with the highest visual impact and developer resonance.")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),
        new Paragraph({ text: "Recommended Sequence:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "1. Discord Chaos section--", bold: true }), new TextRun("Most differentiation; currently furthest from real Discord look")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "2. Hero right panel--", bold: true }), new TextRun("Immediately readable to any Roblox developer")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "3. Role Explorer--", bold: true }), new TextRun("Most interactive; highest engagement section")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "4. How It Works--", bold: true }), new TextRun("Pairs with Stage 2's LuaU syntax work")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "5. Navigation header--", bold: true }), new TextRun("Last, as it's visible on all sections")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 180 } }),

        new Paragraph({ text: "Estimated Effort & Impact:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Total time: ", bold: true }), new TextRun("15-25 hours across all sections")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Highest impact: ", bold: true }), new TextRun("Discord Chaos and Hero Properties Inspector alone transform first impression")] }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: "Per-section: ", bold: true }), new TextRun("2-4 hours depending on complexity")] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 240 } }),

        // CLOSING
        new Paragraph({ children: [new TextRun({ text: "Stage 4 transforms the landing page from generic SaaS to a deeply contextual, tool-native experience. By mapping each section to a recognisable Roblox UI metaphor, we make the platform immediately legible to developers who live in Studio daily.", italic: true })] }),
        new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } }),
        new Paragraph({ children: [new TextRun({ text: "Execution begins with maximum-impact sections (Discord, Properties) and expands to complete the visual overhaul. Each section ships independently, enabling rapid iteration and feedback.", italic: true })] })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("C:\\Users\\cubit\\Downloads\\Weld-app\\stage4_components.docx", buffer);
  console.log("Document created successfully: stage4_components.docx");
});
