#!/usr/bin/env python3
"""Create Stage 2 DOCX directly without python-docx"""
import zipfile
import os
from io import BytesIO

# Document XML content
document_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="72"/><w:color w:val="1F497D"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Stage 2 — LuaU Code Aesthetic &amp; Typography</w:t></w:r></w:p>
    <w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr><w:r><w:rPr><w:sz w:val="48"/><w:color w:val="44546A"/><w:i/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Weld Landing Page Overhaul Series</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/><w:spacing w:before="180" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Overview</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>Stage 2 transforms how text and code look on the page. The current boot sequence lines read like a generic CLI tool. The "How It Works" command steps look like terminal output. Neither signals "Roblox Studio" to a Roblox developer. This stage makes those elements look exactly like the tools developers already live inside: the Roblox Studio Output window, the Script editor, and the Explorer tree panel.</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>The Problem with Current Typography</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Boot sequence lines are just monospace text with letter-spacing—they could be from any dark SaaS tool</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>The "How It Works" command blocks look like bash terminal output, not Luau code</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>There is no visual language in the type system that says "this is a Roblox creator tool"</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Information density is too low—Roblox Studio UI is compact and dense; the current page feels airy and startup-y</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>The shimmer animation on every CTA button cheapens the aesthetic—it's a Webflow template trick</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Change 1: The LuaU Code Block Component</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>The three command steps in "How It Works" currently show terminal-style strings. These must be replaced with a proper LuaU code block component that syntax-highlights like a real Luau script editor.</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Component Specifications</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Background: #0d1117 (darker than page bg, like the script editor tab background)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Font: JetBrains Mono or Fira Code (monospace, same family as Studio's script editor)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Tab bar at the top with fake script names: weld_auth.luau, weld_profile.luau, weld_discover.luau</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Active tab has a bottom border in --studio-blue</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Line numbers in the left gutter (grey, like Studio)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>Syntax coloring using the Stage 1 LuaU palette</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Syntax Color Palette</w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideV w:val="single" w:sz="1" w:color="CCCCCC"/></w:tblBorders><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr>
      <w:tblGrid><w:gridCol w:w="2340"/><w:gridCol w:w="3510"/><w:gridCol w:w="3510"/></w:tblGrid>
      <w:tr><w:tblPrEx><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPrEx><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Token Type</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Color</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Examples</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Keywords</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#c792ea</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>local, function, end, return, if, then</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Strings</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#f78c6c</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>"Scripter", "45 R$/hr"</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Function Names</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#82aaff</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>WeldProfile.build, verify, discover</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Numbers</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#f07178</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>45, 17.3</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Comments</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#546e7a</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>-- PROOF_VERIFIED</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="2340" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Variables</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#c3e88d</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3510" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>dev, profile, result</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p><w:spacing w:after="200"/><w:r><w:t/></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Example LuaU Code</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/><w:color w:val="546e7a"/></w:rPr><w:t>-- weld_auth.luau</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>local WeldProfile = {}</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>function WeldProfile.build(dev)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>dev.role = "Scripter"</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>dev.rate = "45 R$/hr"</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>dev.availability = "Open now"</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>return WeldProfile.verify(dev)</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>end -- PROOF_VERIFIED</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Change 2: The Studio Output Panel</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>The hero boot sequence currently looks generic. It should look like the Roblox Studio Output window. Key changes:</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="3"/></w:numPr></w:pPr><w:r><w:t>Add a fake "Output" panel header with the Studio-style title bar (dark bar, "Output" text left, close X right)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="3"/></w:numPr></w:pPr><w:r><w:t>Prefix each line with a bracketed timestamp: [12:04:01.342]</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="3"/></w:numPr></w:pPr><w:r><w:t>Color-code by severity using Studio's Output colors</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="3"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>The final "READY_FOR_DISCOVERY" line should be bold teal, like a print() success in Studio</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Output Colors by Severity</w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideV w:val="single" w:sz="1" w:color="CCCCCC"/></w:tblBorders><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr>
      <w:tblGrid><w:gridCol w:w="3120"/><w:gridCol w:w="3120"/><w:gridCol w:w="3120"/></w:tblGrid>
      <w:tr><w:tblPrEx><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPrEx><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Severity</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Color</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Usage</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Info</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>White/Light grey</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Status messages</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Success</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#4ec9b0 (Teal)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Completion messages</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Warning</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#ffb347 (Amber)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Non-fatal alerts</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Error</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>#f07178 (Red)</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Error messages</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p><w:spacing w:after="200"/><w:r><w:t/></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>New Boot Sequence Format</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>[12:04:01.001]  Booting weld.roster v2.0...</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>[12:04:01.120]  Loading developer lane...</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>[12:04:01.245]  Scanning shipped work... OK</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>[12:04:01.471]  Verified: 17.3M total visits</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>[12:04:01.620]  Matching studio filters...</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/><w:color w:val="4ec9b0"/></w:rPr><w:t>[12:04:01.781]  READY_FOR_DISCOVERY</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Change 3: Explorer Tree Typography for Role Explorer</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>The current role chips (SCRIPTER, UI/UX, VFX, etc.) are flat pills in a row. They should be restructured to look like the Roblox Studio Explorer tree panel.</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Tree Panel Design</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr></w:pPr><w:r><w:t>Font: monospace, 11px, tighter line-height</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr></w:pPr><w:r><w:t>Each role becomes a "folder" node with an arrow indicator</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr></w:pPr><w:r><w:t>Clicking expands to show child nodes: role stats, skills as child items</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>The active/selected node has a Studio-blue highlight row (full width, like Explorer selection)</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Tree Structure</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="720"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> Workspace</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> Scripter          [open now  45 R$/hr]</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="2160"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>  LUAU</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="2160"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>  OOP</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="2160"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>  DATASTORESERVICE</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> UI / UX           [open this week  35 R$/hr]</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> VFX               [3 slots open  30 R$/hr]</w:t></w:r></w:p>
    <w:p><w:pPr><w:ind w:left="1440"/><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New"/><w:sz w:val="18"/></w:rPr><w:t> Builder           [sprint lane  25 R$/hr]</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Change 4: Information Density  Font Sizing</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>Current font sizes are too generous. The page breathes too much for a tool aimed at developers. Proposed changes:</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr></w:pPr><w:r><w:t>Body text: reduce from implied 14–15px to 13px</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr></w:pPr><w:r><w:t>Mono text in boot sequence: reduce from 11px to 10px (tighter, denser)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr></w:pPr><w:r><w:t>Add a "compact mode" variant for the stats section—pack numbers closer together</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr></w:pPr><w:r><w:t>Replace the loose section padding with tighter values in key areas</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>The hero profile card metadata should pack more rows in the same space</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Change 5: Kill the Shimmer, Add Targeted Glow</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>The current .command-button::before has a shimmer animation running at all times. This is a 2019 Webflow template move. Replace with:</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="6"/></w:numPr></w:pPr><w:r><w:t>No shimmer on idle state</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="6"/></w:numPr></w:pPr><w:r><w:t>On hover only: a clean glow box-shadow using --studio-blue</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="6"/></w:numPr></w:pPr><w:r><w:t>CTA button hover: box-shadow: 0 0 32px rgba(0, 162, 255, 0.45)</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="6"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>Border color shifts to studio blue on hover instead of just brightening</w:t></w:r></w:p>
    <w:p><w:pPr><w:pageBreakBefore/></w:pPr><w:r><w:t/></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Implementation Order</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr></w:pPr><w:r><w:t>Create a SyntaxBlock component in src/components/SyntaxBlock.tsx</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr></w:pPr><w:r><w:t>Update the HOW_COMMANDS rendering in MarketingPage.tsx to use SyntaxBlock</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr></w:pPr><w:r><w:t>Update the boot sequence container to add the Output panel header</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr></w:pPr><w:r><w:t>Update .terminal-chip styles to Explorer tree layout</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr></w:pPr><w:r><w:t>Update globals.css to remove shimmer from idle state</w:t></w:r></w:p>
    <w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="7"/></w:numPr><w:spacing w:after="200"/></w:pPr><w:r><w:t>Add targeted glow CSS for hover states</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Effort  Impact</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>Estimated implementation time: 3–5 hours. Files changed: globals.css, MarketingPage.tsx (2 sections), new SyntaxBlock component. This stage is where Roblox developers first feel "they get us."</w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Key Metrics</w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideH w:val="single" w:sz="1" w:color="CCCCCC"/><w:insideV w:val="single" w:sz="1" w:color="CCCCCC"/></w:tblBorders><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPr>
      <w:tblGrid><w:gridCol w:w="4680"/><w:gridCol w:w="4680"/></w:tblGrid>
      <w:tr><w:tblPrEx><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tblCellMar></w:tblPrEx><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Metric</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/><w:shd w:fill="D5E8F0" w:type="clear"/></w:tcPr><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Value</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Estimated Implementation Time</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>3–5 hours</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Files Modified</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>3 (globals.css, MarketingPage.tsx, SyntaxBlock.tsx)</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Components Created</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>1 (SyntaxBlock)</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Impact</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="4680" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Developer alignment—signals "this tool speaks our language"</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p><w:spacing w:after="200"/><w:r><w:t/></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/><w:rFonts w:ascii="Arial"/></w:rPr><w:t>Summary</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r><w:t>Stage 2 moves Weld beyond a generic dark SaaS aesthetic into a cohesive visual system rooted in Roblox's own development tools. By adopting the typography, code styling, and UI patterns that Roblox developers see every day in Studio, we communicate that Weld is built "for us, by us." The changes are surgical but high-impact: three new components, two CSS updates, and tighter information density transform the page from aspirational startup pitch to credible developer platform.</w:t></w:r></w:p>
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>
  </w:body>
</w:document>'''

# Numbering XML
numbering_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
             xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="2"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="3"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="4"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="5"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="6"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="7"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>'''

# Content types
content_types_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>'''

# Document rels
document_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>'''

# Root rels
root_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>'''

# Styles
styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="Heading 2"/><w:pPr><w:pStyle w:val="Heading2"/><w:spacing w:before="180" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="52"/><w:color w:val="2E5C8A"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="Heading 3"/><w:pPr><w:pStyle w:val="Heading3"/><w:spacing w:before="120" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="48"/><w:color w:val="44546A"/></w:rPr></w:style>
</w:styles>'''

# Font table
font_table_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fontTable xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="Arial"><w:panose1 w:val="020B0604020202020204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/></w:font>
  <w:font w:name="Courier New"><w:panose1 w:val="020407030205080804020002"/><w:charset w:val="00"/><w:family w:val="modern"/><w:pitch w:val="fixed"/></w:font>
</w:fontTable>'''

# Core properties
core_props_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/officeDocument/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Stage 2 - LuaU Code Aesthetic & Typography</dc:title>
  <dc:creator>Weld Team</dc:creator>
  <cp:lastModifiedBy>Weld</cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
</cp:coreProperties>'''

# Create DOCX
docx_path = "C:\\Users\\cubit\\Downloads\\Weld-app\\stage2_typography.docx"

with zipfile.ZipFile(docx_path, 'w', zipfile.ZIP_DEFLATED) as docx:
    # Add [Content_Types].xml
    docx.writestr('[Content_Types].xml', content_types_xml)

    # Add _rels/.rels
    docx.writestr('_rels/.rels', root_rels_xml)

    # Add word/document.xml
    docx.writestr('word/document.xml', document_xml)

    # Add word/numbering.xml
    docx.writestr('word/numbering.xml', numbering_xml)

    # Add word/_rels/document.xml.rels
    docx.writestr('word/_rels/document.xml.rels', document_rels_xml)

    # Add word/styles.xml
    docx.writestr('word/styles.xml', styles_xml)

    # Add word/fontTable.xml
    docx.writestr('word/fontTable.xml', font_table_xml)

    # Add docProps/core.xml
    docx.writestr('docProps/core.xml', core_props_xml)

print(f"Document created successfully: {docx_path}")
