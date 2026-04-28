const { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel, BorderStyle, TextRun, PageBreak, WidthType, VerticalAlign, UnderlineType, ShadingType, AlignmentType } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [
    {
      children: [
        // Title Section
        new Paragraph({
          text: 'Stage 1',
          style: 'Heading1',
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
          shading: {
            type: ShadingType.CLEAR,
            color: '090b14',
          },
          border: {
            bottom: {
              color: '00a2ff',
              space: 1,
              style: BorderStyle.DOUBLE,
              size: 24,
            },
          },
        }),
        new Paragraph({
          text: 'Color System & Token Overhaul',
          style: 'Heading2',
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          color: '00a2ff',
        }),
        new Paragraph({
          text: 'Weld Landing Page Overhaul Series',
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          color: '546e7a',
          italic: true,
        }),

        // Overview Heading
        new Paragraph({
          text: 'Overview',
          style: 'Heading1',
          color: '00a2ff',
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: 'Stage 1 is the foundation of the entire overhaul. It costs the least effort (pure CSS variable changes) but delivers the highest immediate perception shift. The goal is to replace the current "dark fintech SaaS" palette with a color system that Roblox developers instantly recognise as native to their world — drawing from Roblox Studio\'s interface and LuaU\'s syntax highlighting.',
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        // Why Current Palette Fails
        new Paragraph({
          text: 'Why the Current Palette Fails',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'The current background (#0c0e0f) reads as generic startup dark mode — it lacks the characteristic navy-black depth of Roblox Studio\'s own UI',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'The dominant orange-hot (#ff5a2d) is a SaaS accent color, not a Roblox-native signal',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'The cream (#fff5f0) text on near-black creates a warm contrast that feels like a lifestyle brand, not a developer tool',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'There is no visual language that says "this was built by and for Roblox creators"',
          spacing: { after: 300 },
        }),

        // The New Palette Philosophy
        new Paragraph({
          text: 'The New Palette Philosophy',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'The new color system has four layers:',
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Studio Dark',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'Background stack inspired by Roblox Studio\'s panel system (deep navy-blacks)',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Studio Blue',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'The primary interactive color, pulled from Studio\'s action button blue (#00a2ff)',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'LuaU Syntax Palette',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: '5 functional colors pulled directly from LuaU syntax highlighting themes, each assigned a semantic role in the UI',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Weld Brand Accent',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'Orange/red retained but demoted to CTA energy only, not the primary UI color',
          spacing: { after: 300 },
          indent: { left: 720 },
        }),

        // Token Table
        new Paragraph({
          text: 'Detailed Token Reference',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        createTokenTable(),

        new Paragraph({
          text: '',
          spacing: { after: 300 },
        }),

        // Page Break
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        }),

        // Semantic Color Roles
        new Paragraph({
          text: 'Semantic Color Roles',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'Each LuaU syntax color maps to a specific UI function:',
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: 'Purple (Keyword) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Labels, tags, badges — things that "declare" something',
              bold: false,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Orange (String) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Values, handles, names — things that ARE something',
              bold: false,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Blue (Function) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Actions, navigation, calls-to-action — things you DO',
              bold: false,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Teal (Type) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Verification, trust, success — things that are PROVEN',
              bold: false,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Green (Variable) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Availability, live state, open — things that are NOW',
              bold: false,
            }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Grey (Comment) — ',
          bold: true,
          children: [
            new TextRun({
              text: 'Metadata, timestamps, hints — things that explain',
              bold: false,
            }),
          ],
          spacing: { after: 300 },
        }),

        // Background Depth System
        new Paragraph({
          text: 'Background Depth System',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'The new background system uses four distinct depth levels, creating a visual hierarchy that Roblox developers instantly recognise from the Explorer and Properties panels in Roblox Studio:',
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '--bg (#090b14)',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'The deepest background layer. Used for the page body and hero section background. This is the "canvas" on which everything else sits.',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: '--bg2 (#0e111c)',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'One level raised. Used for card backgrounds, sidebar panels, and container elements. Visibly distinct from the base background.',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: '--bg-surface (#131726)',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'Two levels raised. Used for role explorer cards, profile panels, and elevated interactive elements.',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: '--bg-hover (#1a1f30)',
          bold: true,
          spacing: { after: 50 },
          indent: { left: 720 },
        }),
        new Paragraph({
          text: 'The most raised level. Used for button hover states, chip hover effects, and transient interactive feedback.',
          spacing: { after: 300 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'This four-level depth system mimics the panel-within-panel nesting that Roblox developers work with daily in Studio. When users see this hierarchy, it signals "this feels like Studio" without any code changes.',
          spacing: { after: 300 },
          italic: true,
        }),

        // CSS Implementation
        new Paragraph({
          text: 'CSS Implementation — globals.css',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'Replace the :root variable block in globals.css with the following:',
          spacing: { after: 150 },
        }),

        createCSSTable(),

        new Paragraph({
          text: '',
          spacing: { after: 300 },
        }),

        // Page Break
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        }),

        // What Doesn't Change
        new Paragraph({
          text: 'What Doesn\'t Change',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'The orange CTA color (#ff5a2d) stays for the primary "CLAIM BETA INVITE" button. It\'s Weld\'s brand signal and should remain punchy and distinctive. This color is demoted from primary UI color to accent-only, which actually strengthens its visual impact.',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'The scan line overlay and terminal grid aesthetic stay. They\'re the right visual direction for the landing page; this Stage 1 update just shifts them from dominant visual language to complementary layer.',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Font families remain unchanged. Typography refinement is Stage 2; this stage is purely chromatic.',
          spacing: { after: 300 },
        }),

        // Effort and Impact
        new Paragraph({
          text: 'Effort & Impact Assessment',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        createEffortTable(),

        new Paragraph({
          text: '',
          spacing: { after: 300 },
        }),

        // Next Stage
        new Paragraph({
          text: 'Stage 2 Dependency',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'Stage 2 (Typography & Syntax Highlighting) depends on this palette being set first. The LuaU syntax colors introduced in Stage 1 are directly applied to:',
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Code block syntax highlighting (keywords, strings, functions, types)',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Role badge and tag styling',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Status indicators and verification badges',
          spacing: { after: 100 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Section headers and subsection labels',
          spacing: { after: 300 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Having the token system in place makes Stage 2 implementation clean: typography changes will reference the already-defined color tokens rather than hardcoding hex values.',
          spacing: { after: 300 },
          italic: true,
        }),

        // Implementation Checklist
        new Paragraph({
          text: 'Implementation Checklist',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'Update :root CSS variables in globals.css with new token values',
          spacing: { after: 80 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Test on light and dark OS theme settings to verify contrast ratios',
          spacing: { after: 80 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Verify that hero section, card panels, and buttons render with new palette',
          spacing: { after: 80 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Take screenshots of landing page at 1440px and 768px viewports',
          spacing: { after: 80 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Run WCAG contrast checker on text over new backgrounds (target AA minimum)',
          spacing: { after: 80 },
          indent: { left: 720 },
        }),

        new Paragraph({
          text: 'Commit changes with message: "Stage 1: Color system & token overhaul"',
          spacing: { after: 300 },
          indent: { left: 720 },
        }),

        // Summary
        new Paragraph({
          text: 'Summary',
          style: 'Heading2',
          color: '00a2ff',
          spacing: { before: 200, after: 150 },
        }),

        new Paragraph({
          text: 'Stage 1 is a high-ROI update. By shifting from a generic SaaS dark palette to a Studio-informed color system with LuaU syntax semantics, the landing page immediately signals "this was designed by developers, for developers." The change is pure CSS — no component refactoring, no JavaScript changes, no DOM alterations. The moment the background darkens to navy and the primary accent shifts to Studio blue, users will feel the difference.',
          spacing: { after: 150 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        new Paragraph({
          text: 'Estimated completion: 30-60 minutes. Estimated visual impact: Transformative.',
          spacing: { after: 0 },
          italic: true,
          color: '00a2ff',
        }),
      ],
    },
  ],
});

function createTokenTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: { value: 600, rule: 'atLeast' },
        children: [
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Token Name',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Old Value',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'New Value',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Role',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Where Used',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
        ],
      }),

      createTokenRow('--bg', '#0c0e0f', '#090b14', 'Base background', 'Page body, hero section'),
      createTokenRow('--bg2', '#080a0b', '#0e111c', 'Panel background', 'Cards, sidebar panels'),
      createTokenRow('--bg-surface', '(new)', '#131726', 'Raised surface', 'Role explorer cards, profile panels'),
      createTokenRow('--bg-hover', '(new)', '#1a1f30', 'Interactive hover', 'Button hover, chip hover'),
      createTokenRow('--studio-blue', '(new)', '#00a2ff', 'Primary interactive', 'CTA buttons, links, active states'),
      createTokenRow('--studio-blue-dark', '(new)', '#0077cc', 'Button pressed', 'Pressed/active button states'),
      createTokenRow('--luau-keyword', '(new)', '#c792ea', 'LuaU keyword purple', 'Syntax blocks, tag labels, badges'),
      createTokenRow('--luau-string', '(new)', '#f78c6c', 'LuaU string orange', 'Code string values, profile handles'),
      createTokenRow('--luau-function', '(new)', '#82aaff', 'LuaU function blue', 'Function names, section labels'),
      createTokenRow('--luau-type', '(new)', '#4ec9b0', 'LuaU type teal', 'Verified badges, success states'),
      createTokenRow('--luau-variable', '(new)', '#c3e88d', 'LuaU variable green', 'Availability indicators, active status'),
      createTokenRow('--luau-comment', '(new)', '#546e7a', 'LuaU comment grey', 'Metadata, timestamps, secondary text'),
      createTokenRow('--orange-hot', '#ff5a2d', '#ff5a2d', 'Weld CTA accent', 'Primary CTA only — scoped'),
      createTokenRow('--cream', '#fff5f0', '#e8eaf6', 'Primary text', 'Body text — cooler white'),
      createTokenRow('--terminal-dark', '#05070d', '#080b18', 'Deep terminal', 'Boot sequence background'),
    ],
  });
}

function createTokenRow(tokenName, oldValue, newValue, role, used) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: '0e111c' },
        children: [
          new Paragraph({
            text: tokenName,
            bold: true,
            color: '00a2ff',
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: '0e111c' },
        children: [
          new Paragraph({
            text: oldValue,
            color: 'c3e88d',
            font: 'Consolas',
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: '0e111c' },
        children: [
          new Paragraph({
            text: newValue,
            color: 'f78c6c',
            font: 'Consolas',
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: '0e111c' },
        children: [
          new Paragraph({
            text: role,
            color: 'e8eaf6',
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, color: '0e111c' },
        children: [
          new Paragraph({
            text: used,
            color: 'e8eaf6',
            fontSize: 20,
          }),
        ],
      }),
    ],
  });
}

function createCSSTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '1a1f30' },
            children: [
              new Paragraph({
                text: 'BEFORE (Current)',
                bold: true,
                color: '00a2ff',
              }),
              new Paragraph({
                text: ':root {',
                font: 'Consolas',
                color: '82aaff',
              }),
              new Paragraph({
                text: '  --bg: #0c0e0f;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --bg2: #080a0b;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --orange-hot: #ff5a2d;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --cream: #fff5f0;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --roblox-blue: #229bd2;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '}',
                font: 'Consolas',
                color: '82aaff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '1a1f30' },
            children: [
              new Paragraph({
                text: 'AFTER (New)',
                bold: true,
                color: '00a2ff',
              }),
              new Paragraph({
                text: ':root {',
                font: 'Consolas',
                color: '82aaff',
              }),
              new Paragraph({
                text: '  --bg: #090b14;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --bg2: #0e111c;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --bg-surface: #131726;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --bg-hover: #1a1f30;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --studio-blue: #00a2ff;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --studio-blue-dark: #0077cc;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-keyword: #c792ea;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-string: #f78c6c;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-function: #82aaff;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-type: #4ec9b0;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-variable: #c3e88d;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --luau-comment: #546e7a;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --orange-hot: #ff5a2d;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --cream: #e8eaf6;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '  --terminal-dark: #080b18;',
                font: 'Consolas',
                color: 'e8eaf6',
              }),
              new Paragraph({
                text: '}',
                font: 'Consolas',
                color: '82aaff',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createEffortTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        height: { value: 500, rule: 'atLeast' },
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Dimension',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '00a2ff' },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                text: 'Details',
                bold: true,
                color: 'ffffff',
              }),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'Implementation Time',
                bold: true,
                color: '00a2ff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: '30–60 minutes. One file changed: globals.css (:root block only). Zero component code changes required.',
                color: 'e8eaf6',
              }),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'Testing Scope',
                bold: true,
                color: '00a2ff',
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'Visual regression testing, contrast checker on text layers, cross-browser verification (Chrome, Safari, Firefox)',
                color: 'e8eaf6',
              }),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'Visual Impact',
                bold: true,
                color: 'c3e88d',
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'Transformative. The page stops reading as generic SaaS the moment the background and accent shifts. Users immediately perceive "this was designed for Roblox developers."',
                color: 'e8eaf6',
              }),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'ROI Ratio',
                bold: true,
                color: '4ec9b0',
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: '0e111c' },
            children: [
              new Paragraph({
                text: 'High. Minimal implementation effort for maximum perception shift. This is a high-ROI first stage.',
                color: 'e8eaf6',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

Packer.toFile(doc, '/sessions/keen-friendly-lovelace/mnt/Weld-app/stage1_color_system.docx');
console.log('Document created: stage1_color_system.docx');
