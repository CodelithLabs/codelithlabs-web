// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/[slug]/page.tsx
// Dynamic tool page with proper error handling
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllSlugs, getRelatedTools, isToolIndexable } from '@/lib/tools-registry';
import { TOOL_CATEGORIES } from '@/types/tool';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { getToolContent } from '@/lib/content-loader';
import ToolMapper from './tool-mapper';
import Link from 'next/link';

const TOOL_SEO_OVERRIDES: Record<string, { description: string }> = {
  // ─── Text Tools ───────────────────────────────────────────────────────────
  'word-counter': {
    description: 'Free Word Counter that shows word count, character count, sentence count, paragraph count, and estimated reading time in real time. Paste any text and get instant stats — 100% client-side with zero data transmission.',
  },
  'case-converter': {
    description: 'Free Case Converter to transform text into uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and PascalCase instantly. 100% client-side, privacy-first, and no sign-up required.',
  },
  'text-diff': {
    description: 'Free Text Diff Checker that compares two documents side-by-side and highlights every insertion, deletion, and change — just like GitHub diffs. Perfect for contract revisions and code review. No upload, fully browser-based.',
  },
  'lorem-ipsum-generator': {
    description: 'Generate Lorem Ipsum placeholder text by word count, sentence count, or paragraph count instantly. Customize output for mockups, prototypes, and web designs. Free, browser-based, and no sign-up needed.',
  },
  'text-to-slug': {
    description: 'Convert any title or phrase into a clean, URL-friendly slug instantly. Handles special characters, accents, and spaces automatically. Free Slug Generator — 100% client-side, no sign-up required.',
  },
  'duplicate-remover': {
    description: 'Remove duplicate lines from any text list in one click. Sort, deduplicate, and clean up datasets, email lists, or word lists instantly. Free browser-based Duplicate Remover — your data never leaves your device.',
  },
  'word-frequency-counter': {
    description: 'Count how often each word appears in your text with a ranked frequency table. Ideal for content analysis, SEO keyword density checks, and text research. Free Word Frequency Counter — 100% client-side.',
  },
  'headline-analyzer': {
    description: 'Analyze your headlines and titles for SEO strength, emotional impact, power word density, and readability score. Optimize headlines for higher click-through rates. Free Headline Analyzer — no sign-up, instant results.',
  },
  'reading-time-calculator': {
    description: 'Calculate the estimated reading time for any article, blog post, or document based on average adult reading speed. Enter a URL or paste text. Free Reading Time Calculator — 100% client-side.',
  },
  'cta-generator': {
    description: 'Generate compelling call-to-action button text and phrases for landing pages, emails, and ads. AI-powered suggestions tailored to your goal and audience. Free CTA Generator — no API key, no sign-up required.',
  },
  'bio-generator': {
    description: 'Generate a professional bio for LinkedIn, Twitter, GitHub, or website About pages in seconds. Input your role and achievements, get polished output. Free AI Bio Generator — 100% client-side, no data stored.',
  },
  // ─── Developer Tools ──────────────────────────────────────────────────────
  'json-formatter': {
    description: 'Free JSON Formatter, Beautifier & Validator that formats JSON with syntax highlighting, detects errors on the exact line, and minifies for production. 100% client-side — your JSON never reaches a server.',
  },
  'base64-encoder': {
    description: 'Encode any text or file to Base64 and decode Base64 strings back to plain text instantly. Perfect for API payloads, data URIs, and MIME encoding. Free Base64 Encoder/Decoder — browser-based, zero server transmission.',
  },
  'url-encoder': {
    description: 'URL-encode special characters for safe use in query strings, form data, and path segments. Decode percent-encoded URLs instantly. Free URL Encoder/Decoder — 100% client-side, no sign-up required.',
  },
  'regex-tester': {
    description: 'Test and debug regular expressions in real time with match highlighting, capture group extraction, and a built-in regex cheat sheet. Free Regex Tester — 100% client-side, supports JavaScript regex syntax.',
  },
  'html-entity-encoder': {
    description: 'Convert special characters like <, >, &, and " to HTML entities and back. Prevent XSS vulnerabilities and display code safely in web pages. Free HTML Entity Encoder — instant, browser-based, no sign-up.',
  },
  'jwt-decoder': {
    description: 'Decode and inspect JWT header, payload, and signature instantly without sending your token to any server. Verify claims, check expiry, and debug auth issues safely. Free JWT Decoder — 100% client-side.',
  },
  'api-tester': {
    description: 'Send GET, POST, PUT, DELETE, and PATCH requests with custom headers and body — like Postman, directly in your browser. Debug REST APIs and inspect responses instantly. Free API Tester — no install required.',
  },
  'cron-expression-generator': {
    description: 'Build cron expressions from plain-English schedules and preview the next 5 execution times. Supports standard cron and extended expressions. Free Cron Expression Generator — 100% client-side, no sign-up.',
  },
  'html-to-jsx': {
    description: 'Convert HTML markup to valid JSX syntax for React components in one step — handles className, camelCase props, and self-closing tags. Free HTML to JSX Converter — browser-based, no sign-up required.',
  },
  'diff-checker': {
    description: 'Compare two code files or text blocks line-by-line with highlighted diffs. No file upload to any server. Free Diff Checker — fast, client-side, ideal for code reviews and document comparison.',
  },
  'json-path-finder': {
    description: 'Query and extract values from complex JSON using JSONPath expressions with live results. Debug nested API responses instantly. Free JSON Path Finder — 100% client-side, no data transmitted.',
  },
  'regex-generator': {
    description: 'Describe what you want to match in plain English and get a ready-to-use regex pattern. Validates against your test strings in real time. Free AI Regex Generator — browser-based, no API key required.',
  },
  'typescript-to-js': {
    description: 'Convert TypeScript to plain JavaScript instantly — strips type annotations, interfaces, and enums while preserving logic. Free TypeScript to JS Converter — 100% client-side, no compile server needed.',
  },
  'json-schema-generator': {
    description: 'Generate a JSON Schema from any JSON object instantly. Infers types, required fields, and nesting depth automatically. Free JSON Schema Generator — browser-based, zero server transmission.',
  },
  'sql-to-mongodb': {
    description: 'Convert SQL SELECT, INSERT, UPDATE, and DELETE queries to equivalent MongoDB query syntax. Free SQL to MongoDB Converter — 100% client-side, perfect for migration projects.',
  },
  'graphql-query-builder': {
    description: 'Build GraphQL queries and mutations visually with a schema-driven editor. Generate type-safe query strings ready to copy into your code. Free GraphQL Query Builder — browser-based, no sign-up.',
  },
  'docker-compose-generator': {
    description: 'Generate Docker Compose YAML files from service configurations visually. Supports volumes, networks, environment variables, and health checks. Free Docker Compose Generator — 100% client-side.',
  },
  'dotenv-editor': {
    description: 'View, edit, and validate .env files with syntax checking and comment support. Convert between .env and JSON formats. Free .env Editor — browser-based, your secrets never leave your device.',
  },
  'gitignore-generator': {
    description: 'Generate a .gitignore file for any tech stack — Node.js, Python, Java, Go, and more — with a single click. Free .gitignore Generator — 100% client-side, no sign-up required.',
  },
  'chmod-calculator': {
    description: 'Calculate Unix file permission numbers from checkboxes and convert octal chmod values to human-readable rwx format. Free chmod Calculator — instant, browser-based, no sign-up.',
  },
  'http-status-codes': {
    description: 'Look up HTTP status codes with descriptions, use cases, and RFC references. Search by number or keyword. Free HTTP Status Code Reference — 100% client-side, always available offline.',
  },
  'regex-library': {
    description: 'Browse a curated library of common regex patterns for emails, URLs, phone numbers, dates, and more. Copy and test instantly. Free Regex Library — 100% client-side, no sign-up required.',
  },
  'npm-package-checker': {
    description: 'Look up npm package details, latest version, dependencies, and weekly downloads from npm registry. Free npm Package Checker — instant lookup, no sign-up required.',
  },
  'curl-to-fetch': {
    description: 'Convert curl command-line requests to JavaScript fetch() or Axios calls instantly. Handles headers, body, auth, and cookies. Free curl to fetch Converter — 100% client-side.',
  },
  'json-to-go': {
    description: 'Convert JSON objects to Go struct definitions with proper field names, types, and json tags automatically. Free JSON to Go Converter — browser-based, zero data transmission.',
  },
  'git-command-generator': {
    description: 'Generate the exact Git commands you need from a description of what you want to do. Covers branches, rebasing, stashing, and history rewriting. Free Git Command Generator — 100% client-side.',
  },
  'env-to-json': {
    description: 'Convert .env file content to JSON and back in one click. Handle multiline values and inline comments correctly. Free .env to JSON Converter — browser-based, your secrets never leave your device.',
  },
  'base64-image-encoder': {
    description: 'Convert image files to Base64 data URIs for embedding in HTML, CSS, and emails. Drag and drop any image and copy the output instantly. Free Base64 Image Encoder — 100% client-side, no upload.',
  },
  'json-to-typescript': {
    description: 'Generate TypeScript interfaces and types from any JSON object in seconds. Handles nested objects, arrays, and optional fields. Free JSON to TypeScript Converter — 100% client-side.',
  },
  'sql-to-prisma': {
    description: 'Convert SQL CREATE TABLE statements to Prisma schema definitions automatically. Handles relations, indexes, and constraints. Free SQL to Prisma Converter — browser-based, no sign-up.',
  },
  'css-to-tailwind': {
    description: 'Convert CSS properties and rules to Tailwind CSS utility class equivalents instantly. Free CSS to Tailwind Converter — 100% client-side, ideal for migrating legacy stylesheets.',
  },
  // ─── Image Tools ──────────────────────────────────────────────────────────
  'image-resizer': {
    description: 'Resize images to exact pixel dimensions or percentage scale without leaving your browser. Supports JPG, PNG, WebP, and GIF. Free Image Resizer — 100% client-side, your images never leave your device.',
  },
  'image-compressor': {
    description: 'Compress JPEG and PNG images by up to 80% without visible quality loss. Ideal for optimizing Core Web Vitals and reducing page load time. Free Image Compressor — browser-based, zero server upload.',
  },
  'image-cropper': {
    description: 'Crop images with freeform selection or fixed aspect ratios for social media, profile photos, and web use. Free Image Cropper — 100% client-side, instant preview, no sign-up required.',
  },
  'png-to-jpg': {
    description: 'Convert PNG images to JPG format with adjustable quality settings in your browser. Free PNG to JPG Converter — instant conversion, zero server upload, your images stay private.',
  },
  'jpg-to-png': {
    description: 'Convert JPG images to lossless PNG format instantly in your browser. Ideal for graphics, logos, and transparent backgrounds. Free JPG to PNG Converter — 100% client-side, no sign-up.',
  },
  'social-media-resizer': {
    description: 'Resize images to exact dimensions for Instagram, Twitter, LinkedIn, Facebook, YouTube, and Pinterest in one click. Free Social Media Image Resizer — 100% client-side, no sign-up required.',
  },
  'privacy-blur': {
    description: 'Blur faces, license plates, and sensitive areas in screenshots and photos before sharing. Free Privacy Blur Tool — 100% client-side, your images never leave your device.',
  },
  'image-to-base64': {
    description: 'Convert any image file to a Base64 data URI for embedding directly in HTML, CSS, or JSON. Free Image to Base64 Tool — instant browser conversion, zero server upload.',
  },
  'webp-converter': {
    description: 'Convert images to and from WebP format for optimal web performance. Supports JPG, PNG, and GIF input. Free WebP Converter — 100% client-side, no server upload required.',
  },
  'image-filters': {
    description: 'Apply artistic filters — grayscale, sepia, blur, brightness, contrast, and saturation — to images with live preview. Free Image Filter Tool — 100% client-side, your photos stay private.',
  },
  'image-watermark': {
    description: 'Add custom text or logo watermarks to images with adjustable opacity, position, and font size. Free Image Watermark Tool — browser-based, zero server upload, no sign-up.',
  },
  'background-remover': {
    description: 'Remove backgrounds from product photos, portraits, and graphics automatically. Download as transparent PNG. Free Background Remover — AI-powered, browser-based, no sign-up required.',
  },
  'color-picker': {
    description: 'Pick colors from uploaded images or your screen using an eyedropper and get HEX, RGB, and HSL values instantly. Free Color Picker — 100% client-side, no sign-up required.',
  },
  'pdf-to-image': {
    description: 'Convert PDF pages to PNG or JPEG images at your chosen resolution — entirely in your browser. Free PDF to Image Converter — client-side with PDF.js, no file upload to any server.',
  },
  'svg-to-png': {
    description: 'Convert SVG vector files to PNG raster images at any resolution. Drag and drop to convert instantly. Free SVG to PNG Converter — 100% client-side, no sign-up required.',
  },
  'favicon-generator': {
    description: 'Generate favicon files in 16×16, 32×32, and 64×64 from any image or text. Download ICO, PNG, and Apple Touch icon formats. Free Favicon Generator — browser-based, no sign-up.',
  },
  // ─── Converters ───────────────────────────────────────────────────────────
  'color-converter': {
    description: 'Convert colors between HEX, RGB, HSL, HSV, and CMYK formats instantly with live color preview. Free Color Converter — 100% client-side, no sign-up, ideal for designers and developers.',
  },
  'markdown-to-html': {
    description: 'Convert Markdown to HTML with GitHub Flavored Markdown support — tables, code blocks, task lists, and more. Free Markdown to HTML Converter — 100% client-side, no sign-up required.',
  },
  'csv-to-json': {
    description: 'Convert CSV files and pasted spreadsheet data to JSON with automatic delimiter detection. Free CSV to JSON Converter — 100% client-side, handles large files, your data stays private.',
  },
  'json-to-csv': {
    description: 'Convert JSON arrays to CSV format for Excel, Google Sheets, and data analysis tools. Free JSON to CSV Converter — browser-based, handles nested objects, zero server transmission.',
  },
  'yaml-to-json': {
    description: 'Convert YAML configuration files to JSON and JSON back to YAML with full spec compliance including anchors and aliases. Free YAML to JSON Converter — 100% client-side.',
  },
  'unix-timestamp-converter': {
    description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds with timezone selection. Free Unix Timestamp Converter — 100% client-side, instant results.',
  },
  'unit-converter': {
    description: 'Convert between length, weight, temperature, speed, area, volume, and digital storage units with real-time bidirectional results. Free Unit Converter — 100% client-side, covers 100+ unit pairs.',
  },
  'json-to-yaml': {
    description: 'Convert JSON objects to YAML format with proper indentation and array handling. Free JSON to YAML Converter — browser-based, supports nested structures, zero data transmission.',
  },
  'roman-numeral': {
    description: 'Convert between Roman numerals and decimal numbers instantly. Great for historical research, clock faces, and academic formatting. Free Roman Numeral Converter — 100% client-side, no sign-up.',
  },
  'binary-converter': {
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal number systems instantly. Shows step-by-step conversion. Free Number Base Converter — 100% client-side, no sign-up required.',
  },
  'html-to-markdown': {
    description: 'Convert HTML markup to clean Markdown format — great for migrating blog posts to static site generators or CMS platforms. Free HTML to Markdown Converter — 100% client-side.',
  },
  'temperature-converter': {
    description: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly with bidirectional input. Free Temperature Converter — browser-based, 100% client-side, no sign-up required.',
  },
  'speed-converter': {
    description: 'Convert between km/h, mph, m/s, knots, and Mach number instantly. Free Speed Converter — 100% client-side, real-time bidirectional conversion, no sign-up required.',
  },
  'weight-converter': {
    description: 'Convert between kilograms, pounds, ounces, grams, stones, and more instantly. Free Weight Converter — browser-based, 100% client-side, covers metric and imperial units.',
  },
  'length-converter': {
    description: 'Convert between meters, feet, inches, centimeters, miles, kilometers, and nautical miles instantly. Free Length Converter — 100% client-side, real-time results, no sign-up required.',
  },
  'data-size-converter': {
    description: 'Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and more — in both binary and decimal standards. Free Data Size Converter — 100% client-side.',
  },
  'number-to-words': {
    description: 'Convert numbers to English words for checks, invoices, legal documents, and educational use. Handles large numbers instantly. Free Number to Words Converter — 100% client-side.',
  },
  // ─── Calculators ──────────────────────────────────────────────────────────
  'percentage-calculator': {
    description: 'Calculate percentage-of, percentage-change, and percentage-difference in a single interface. Free Percentage Calculator — instant results, 100% client-side, no sign-up required.',
  },
  'bmi-calculator': {
    description: 'Calculate your Body Mass Index with WHO classification (Underweight / Normal / Overweight / Obese) and personalized health context. Free BMI Calculator — 100% client-side, your health data stays private.',
  },
  'age-calculator': {
    description: 'Free Age Calculator that computes exact age in years, months, and days from your birthdate. Get accurate results instantly with a fast, browser-based tool that keeps your data private and never uploads input to servers.',
  },
  'loan-calculator': {
    description: 'Calculate loan EMI, total interest payable, and monthly amortization schedule for home loans, car loans, and personal loans. Free Loan Calculator — 100% client-side, your financial data stays private.',
  },
  'calorie-calculator': {
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) and calorie needs for fat loss, maintenance, or muscle gain based on age, weight, height, and activity level. Free Calorie Calculator — 100% client-side.',
  },
  'discount-calculator': {
    description: 'Calculate the discounted price, savings amount, and effective discount percentage for any sale or coupon. Free Discount Calculator — instant results, browser-based, no sign-up required.',
  },
  'tip-calculator': {
    description: 'Split bills and calculate tips for any number of people with adjustable tip percentage. Free Tip Calculator — 100% client-side, instant results, perfect for restaurants and group dining.',
  },
  'mortgage-calculator': {
    description: 'Calculate monthly mortgage payments, total interest, and full amortization schedule including down payment and property tax. Free Mortgage Calculator — 100% client-side, your financial data stays private.',
  },
  'compound-interest-calculator': {
    description: 'Visualize compound interest growth over time with interactive charts. Supports monthly, quarterly, and annual compounding. Free Compound Interest Calculator — 100% client-side, your financial data stays private.',
  },
  'breakeven-calculator': {
    description: 'Calculate the break-even point in units and revenue for any product or business. Visualizes fixed costs, variable costs, and profit zones. Free Break-Even Calculator — 100% client-side.',
  },
  'profit-margin-calculator': {
    description: 'Calculate gross margin, operating margin, and net profit margin from revenue and cost inputs. Free Profit Margin Calculator — instant results, browser-based, ideal for freelancers and small businesses.',
  },
  'invoice-generator': {
    description: 'Create professional invoices with line items, GST/tax support, and payment terms. Download as PDF. Free Invoice Generator — 100% client-side, your business data never leaves your device.',
  },
  'expense-splitter': {
    description: 'Split group expenses fairly with support for unequal splits, tip, and multiple currencies. Free Expense Splitter — 100% client-side, perfect for trips, dinners, and shared bills.',
  },
  'retirement-calculator': {
    description: 'Estimate your retirement corpus and monthly income based on current savings, SIP, and expected returns. Supports Indian context with inflation adjustment. Free Retirement Calculator — 100% client-side.',
  },
  'stock-calculator': {
    description: 'Calculate profit/loss, average buy price, and return percentage for stock investments. Supports multiple trades and brokerage fees. Free Stock Calculator — 100% client-side, your investment data stays private.',
  },
  'pricing-calculator': {
    description: 'Calculate optimal product pricing based on cost, target margin, and competitive positioning. Free Pricing Calculator — instant results, browser-based, ideal for freelancers and startups.',
  },
  'invoice-number-generator': {
    description: 'Generate sequential, date-based, or custom invoice numbers following professional naming conventions. Free Invoice Number Generator — 100% client-side, no sign-up required.',
  },
  'payroll-calculator': {
    description: 'Calculate employee net pay after deductions for tax, PF, EPF, and other contributions. Supports Indian salary structures. Free Payroll Calculator — 100% client-side, payroll data stays private.',
  },
  'working-days-calculator': {
    description: 'Calculate the number of working days between two dates, excluding weekends and Indian public holidays. Free Working Days Calculator — 100% client-side, instant results.',
  },
  'meeting-cost-calculator': {
    description: 'Calculate the real cost of a meeting by entering headcount, average salary, and duration. Helps teams prioritize high-value meetings. Free Meeting Cost Calculator — 100% client-side.',
  },
  'scientific-calculator': {
    description: 'Full-featured scientific calculator with trigonometry, logarithms, exponents, factorials, and constants (π, e). Free Scientific Calculator — browser-based, offline-capable, no sign-up required.',
  },
  'fraction-calculator': {
    description: 'Add, subtract, multiply, and divide fractions with automatic simplification and step-by-step working. Free Fraction Calculator — 100% client-side, perfect for students and educators.',
  },
  'quadratic-equation-solver': {
    description: 'Solve quadratic equations (ax² + bx + c = 0) with real and complex roots, discriminant, and vertex. Free Quadratic Equation Solver — 100% client-side, shows full working.',
  },
  'matrix-calculator': {
    description: 'Perform matrix addition, subtraction, multiplication, determinant, inverse, and transpose operations. Free Matrix Calculator — browser-based, supports up to 5×5 matrices, no sign-up.',
  },
  'probability-calculator': {
    description: 'Calculate probability, combinations, permutations, and conditional probability with step-by-step working. Free Probability Calculator — 100% client-side, ideal for statistics students.',
  },
  'area-calculator': {
    description: 'Calculate area and perimeter for circles, rectangles, triangles, trapezoids, and polygons with visual diagrams. Free Area Calculator — 100% client-side, no sign-up required.',
  },
  'body-fat-calculator': {
    description: 'Calculate body fat percentage using the US Navy method or BMI method based on height, weight, and measurements. Free Body Fat Calculator — 100% client-side, your health data stays private.',
  },
  'ideal-weight-calculator': {
    description: 'Calculate your ideal body weight range using multiple formulae (Hamwi, Devine, Robinson, Miller) for your height and sex. Free Ideal Weight Calculator — 100% client-side.',
  },
  'macro-calculator': {
    description: 'Calculate optimal protein, carbohydrate, and fat macros for your fitness goal — fat loss, maintenance, or muscle gain. Free Macro Calculator — 100% client-side, your health data stays private.',
  },
  'heart-rate-zone-calculator': {
    description: 'Calculate your maximum heart rate and five training zones (recovery, aerobic, anaerobic) for optimal workout programming. Free Heart Rate Zone Calculator — 100% client-side.',
  },
  'pregnancy-due-date-calculator': {
    description: 'Calculate your estimated due date based on last menstrual period or conception date, with week-by-week pregnancy milestones. Free Pregnancy Due Date Calculator — 100% client-side.',
  },
  'pace-calculator': {
    description: 'Calculate running pace, finish time, and distance for 5K, 10K, half marathon, and marathon training. Free Pace Calculator — 100% client-side, no sign-up required.',
  },
  'water-intake-calculator': {
    description: 'Calculate your recommended daily water intake based on body weight, activity level, and climate. Free Water Intake Calculator — 100% client-side, your health data stays private.',
  },
  'sleep-cycle-calculator': {
    description: 'Calculate optimal wake-up times based on 90-minute sleep cycles to wake feeling refreshed. Free Sleep Cycle Calculator — 100% client-side, no sign-up required.',
  },
  'carbon-footprint-calculator': {
    description: 'Estimate your personal or household carbon footprint from transport, energy, diet, and consumption. Free Carbon Footprint Calculator — 100% client-side, your data stays private.',
  },
  'wedding-budget-calculator': {
    description: 'Plan your wedding budget with a breakdown across venue, catering, photography, attire, and more. Free Wedding Budget Calculator — 100% client-side, your financial plans stay private.',
  },
  'electricity-bill-calculator': {
    description: 'Estimate your monthly electricity bill by entering appliance wattage, hours of use, and your utility rate. Free Electricity Bill Calculator — 100% client-side.',
  },
  'paint-calculator': {
    description: 'Calculate the number of paint cans needed for any room based on wall area, coats, and coverage per litre. Free Paint Calculator — instant results, browser-based, no sign-up.',
  },
  'fuel-cost-calculator': {
    description: 'Calculate fuel cost for any trip based on distance, fuel efficiency, and current petrol/diesel price. Free Fuel Cost Calculator — 100% client-side, your travel data stays private.',
  },
  'tile-calculator': {
    description: 'Calculate the number of tiles needed for a floor or wall, with waste percentage. Free Tile Calculator — instant results, browser-based, no sign-up required.',
  },
  'home-loan-affordability': {
    description: 'Find out how much home loan you can afford based on your income, liabilities, and current interest rates. Free Home Loan Affordability Calculator — 100% client-side.',
  },
  'emi-principal-calculator': {
    description: 'Break down any EMI payment into its principal and interest components for any month of your loan tenure. Free EMI Principal Calculator — 100% client-side.',
  },
  'aspect-ratio-calculator': {
    description: 'Calculate equivalent image or video dimensions while preserving any aspect ratio. Free Aspect Ratio Calculator — instant results, 100% client-side, no sign-up required.',
  },
  // ─── Generators ───────────────────────────────────────────────────────────
  'uuid-generator': {
    description: 'Generate cryptographically secure RFC 4122 v4 UUIDs in bulk for database seeding, testing, and distributed systems. Free UUID Generator — browser-based using crypto.getRandomValues, zero server transmission.',
  },
  'password-generator': {
    description: 'Generate strong, random passwords of any length with configurable uppercase, lowercase, digits, and symbols. Includes entropy score. Free Password Generator — 100% client-side, your passwords never touch a server.',
  },
  'qr-code-generator': {
    description: 'Generate QR codes for URLs, text, Wi-Fi credentials, email, phone, and SMS. Customize colors, size, and error correction, then download PNG or SVG. Fast, privacy-first QR Code Generator with no watermark or sign-up.',
  },
  'random-number': {
    description: 'Generate truly random integers or floating-point numbers in any range, with optional bulk output and seed support. Free Random Number Generator — cryptographically secure, 100% client-side.',
  },
  'readme-generator': {
    description: 'Generate a professional README.md for any project with sections for installation, usage, API, contributing, and license. Free README Generator — 100% client-side, no sign-up required.',
  },
  'business-name-generator': {
    description: 'Generate creative, domain-available business name ideas for your startup or brand based on keywords and industry. Free Business Name Generator — AI-powered, browser-based, no sign-up required.',
  },
  'swot-analysis-generator': {
    description: 'Generate a structured SWOT analysis framework for your business, product, or project with AI-suggested talking points. Free SWOT Analysis Generator — 100% client-side, no sign-up.',
  },
  'contract-generator': {
    description: 'Generate simple freelance contracts, NDAs, and service agreements from templates with your details filled in. Free Contract Generator — 100% client-side, your contract data stays private.',
  },
  // ─── Formatters ───────────────────────────────────────────────────────────
  'sql-formatter': {
    description: 'Beautify and indent SQL queries with proper keyword capitalization and clause alignment. Free SQL Formatter — 100% client-side, your database queries never leave your browser.',
  },
  'html-formatter': {
    description: 'Prettify and indent messy HTML markup with configurable indentation (spaces or tabs). Free HTML Formatter — browser-based, instant output, never sends your code to a server.',
  },
  'css-minifier': {
    description: 'Minify CSS files by stripping whitespace, comments, and redundant semicolons for production deployment. Free CSS Minifier — 100% client-side, instant output, no sign-up required.',
  },
  'js-minifier': {
    description: 'Minify JavaScript code for production builds by removing whitespace and shortening variable names. Free JS Minifier — browser-based, your source code never leaves your device.',
  },
  // ─── Encoders ──────────────────────────────────────────────────────────────
  'hash-generator': {
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes for any text using the browser\'s Web Crypto API. Free Hash Generator — 100% client-side, your data never reaches a server.',
  },
  // ─── Security ─────────────────────────────────────────────────────────────
  'password-strength-checker': {
    description: 'Check password strength with entropy calculation, pattern detection, and actionable improvement tips. Free Password Strength Checker — 100% client-side, your passwords are never transmitted.',
  },
  'website-security-checker': {
    description: 'Analyze a website\'s HTTP security headers, HTTPS configuration, and CSP policy for vulnerabilities. Free Website Security Checker — identify missing HSTS, X-Frame-Options, and more instantly.',
  },
  // ─── SEO Tools ────────────────────────────────────────────────────────────
  'meta-tag-generator': {
    description: 'Generate complete HTML meta tags — title, description, canonical, Open Graph, and Twitter Card — with live preview. Free Meta Tag Generator — 100% client-side, no sign-up required.',
  },
  'open-graph-generator': {
    description: 'Generate Open Graph tags with a real-time preview of how your page will look on Facebook, Twitter, and LinkedIn. Free Open Graph Generator — 100% client-side, no sign-up required.',
  },
  'robots-txt-generator': {
    description: 'Create a robots.txt file with directives for Googlebot, Bingbot, and custom crawlers. Includes presets for popular CMS platforms. Free robots.txt Generator — 100% client-side.',
  },
  'sitemap-generator': {
    description: 'Generate an XML sitemap from a list of URLs with customizable priority, changefreq, and lastmod. Free Sitemap Generator — browser-based, download instantly, no sign-up required.',
  },
  'faq-schema-generator': {
    description: 'Generate FAQPage JSON-LD structured data for rich results in Google Search from a list of questions and answers. Free FAQ Schema Generator — 100% client-side.',
  },
  'local-business-schema': {
    description: 'Generate LocalBusiness JSON-LD schema markup for Google Maps, Knowledge Panel, and rich local results. Free Local Business Schema Generator — 100% client-side, no sign-up.',
  },
  'nap-checker': {
    description: 'Verify your business Name, Address, and Phone (NAP) consistency across search engines and directories. Free NAP Checker — instant lookup, essential for local SEO audits.',
  },
  'review-response-generator': {
    description: 'Generate professional, personalized responses to Google and Yelp reviews — both positive and negative — with AI. Free Review Response Generator — browser-based, no sign-up required.',
  },
  'gmb-post-generator': {
    description: 'Generate engaging Google Business Profile (GMB) posts for offers, events, products, and updates. Free GMB Post Generator — AI-powered, 100% client-side, no sign-up required.',
  },
  'service-area-schema': {
    description: 'Generate Service Area JSON-LD schema markup for businesses serving multiple geographic zones. Free Service Area Schema Generator — 100% client-side.',
  },
  'citation-formatter': {
    description: 'Format business citations for local SEO directories in consistent NAP format across platforms. Free Citation Formatter — 100% client-side, no sign-up required.',
  },
  'local-keywords-generator': {
    description: 'Generate location-targeted keyword suggestions for local SEO campaigns based on business type and city. Free Local Keywords Generator — AI-powered, browser-based, no sign-up.',
  },
  'hours-schema-generator': {
    description: 'Generate OpeningHoursSpecification JSON-LD schema for your business hours, including special holiday hours. Free Hours Schema Generator — 100% client-side.',
  },
  'product-schema-generator': {
    description: 'Generate Product JSON-LD schema with price, availability, reviews, and offers for rich product results in Google. Free Product Schema Generator — 100% client-side, no sign-up.',
  },
  // ─── AI Repurposing Tools ─────────────────────────────────────────────────
  'blog-to-twitter-thread': {
    description: 'Convert any blog post or article into a structured Twitter/X thread with hooks, numbered tweets, and a CTA. Free Blog to Twitter Thread Converter — AI-powered, browser-based, no sign-up required.',
  },
  'blog-to-linkedin-post': {
    description: 'Repurpose blog content into an engaging LinkedIn post with professional formatting and a strong hook. Free Blog to LinkedIn Post Converter — AI-powered, browser-based, no API key needed.',
  },
  'article-to-bullet-points': {
    description: 'Extract the key points from any article or document as a clean, scannable bullet-point summary. Free Article to Bullet Points Converter — 100% client-side, no sign-up required.',
  },
  'youtube-script-to-blog': {
    description: 'Convert a YouTube video script or transcript into a formatted blog post with headings and paragraphs. Free YouTube Script to Blog Converter — AI-powered, browser-based, no sign-up.',
  },
  'podcast-notes-generator': {
    description: 'Generate structured show notes, key takeaways, and timestamps from podcast transcripts or notes. Free Podcast Notes Generator — AI-powered, 100% client-side, no sign-up.',
  },
  'email-to-tweet': {
    description: 'Distill a long email or newsletter into a punchy, attention-grabbing tweet. Free Email to Tweet Converter — AI-powered, browser-based, no API key or sign-up required.',
  },
  'long-form-to-short': {
    description: 'Condense long-form content — articles, reports, scripts — into short punchy summaries for any platform. Free Long-Form to Short Converter — AI-powered, 100% client-side.',
  },
  'text-to-faq': {
    description: 'Turn any text, article, or documentation into a structured FAQ format with questions and answers. Free Text to FAQ Generator — AI-powered, browser-based, ideal for SEO and help centres.',
  },
  'content-to-carousel': {
    description: 'Convert blog posts or key points into a multi-slide carousel format for LinkedIn or Instagram. Free Content to Carousel Generator — AI-powered, 100% client-side, no sign-up.',
  },
  'meeting-to-actions': {
    description: 'Extract action items, owners, and deadlines from meeting notes or transcripts automatically. Free Meeting to Action Items Generator — AI-powered, browser-based, no sign-up required.',
  },
  // ─── AI Tools ─────────────────────────────────────────────────────────────
  'sentiment-analyzer': {
    description: 'Analyze text sentiment as positive, negative, or neutral with emotion detection (joy, anger, sadness, surprise). Free Sentiment Analyzer — 100% client-side, ideal for review analysis and social monitoring.',
  },
  'text-summarizer': {
    description: 'Generate concise summaries of long documents, articles, and reports using extractive summarization. Free Text Summarizer — 100% client-side, your documents never leave your browser.',
  },
  'paraphraser': {
    description: 'Rewrite sentences and paragraphs in different styles while preserving the original meaning. Free AI Paraphraser — browser-based, no API key required, helps avoid plagiarism.',
  },
  'grammar-checker': {
    description: 'Check spelling, grammar, punctuation, and style in your writing with actionable suggestions. Free Grammar Checker — 100% client-side, your writing stays completely private.',
  },
  'ai-color-palette': {
    description: 'Generate professional color palettes from text descriptions like "sunset over mountains" using color theory AI. Free AI Color Palette Generator — 100% client-side, no API key required.',
  },
  'text-to-speech': {
    description: 'Convert any text to speech using your browser\'s built-in Web Speech API. Adjust voice, pitch, and rate. Free Text to Speech Tool — 100% client-side, no audio uploaded to any server.',
  },
  'code-explainer': {
    description: 'Paste any code snippet and get a plain-English explanation of what it does, line by line. Free Code Explainer — AI-powered, browser-based, supports 20+ programming languages.',
  },
  'ai-translator': {
    description: 'Translate text between 50+ languages using AI-powered browser-based models. Free AI Translator — no API key required, 100% client-side, your text stays completely private.',
  },
  'email-generator': {
    description: 'Generate professional emails for any scenario — sales, follow-up, apology, or cold outreach — with AI. Free Email Generator — 100% client-side, your communications stay private.',
  },
  // ─── Finance / India ──────────────────────────────────────────────────────
  'crypto-converter': {
    description: 'Convert cryptocurrency values between BTC, ETH, BNB, and 50+ altcoins and fiat currencies in real time. Free Crypto Converter — live market data, no sign-up, instant conversion.',
  },
  'currency-converter': {
    description: 'Convert between 170+ global currencies with real-time exchange rates. Free Currency Converter — live rates, 100% client-side computation, no sign-up required.',
  },
  'tax-calculator-india': {
    description: 'Calculate income tax under Old and New tax regimes for FY 2024-25 with automatic surcharge, cess, and rebate computation. Free India Income Tax Calculator — 100% client-side, your salary data stays private.',
  },
  'salary-calculator': {
    description: 'Calculate your take-home salary from CTC in India — breaks down basic, HRA, PF, gratuity, professional tax, and net in-hand. Free CTC to In-Hand Salary Calculator — 100% client-side.',
  },
  'investment-comparator': {
    description: 'Compare returns across FD, PPF, NPS, Mutual Funds, and Gold investments side by side for any tenure and amount. Free Investment Comparator — 100% client-side, your financial data stays private.',
  },
  'gold-silver-calculator': {
    description: 'Calculate the current value of your gold and silver holdings based on live prices and purity (22K/24K). Free Gold & Silver Value Calculator — live prices, 100% client-side.',
  },
  'capital-gains-tax': {
    description: 'Calculate Short-Term and Long-Term Capital Gains Tax on shares, mutual funds, and property under Indian tax law. Free Capital Gains Tax Calculator — 100% client-side, your investment data stays private.',
  },
  'gst-calculator-india': {
    description: 'Calculate GST amount and total price (inclusive/exclusive) for 5%, 12%, 18%, and 28% slabs. Free GST Calculator for India — instant results, 100% client-side.',
  },
  'ppf-calculator': {
    description: 'Calculate your PPF (Public Provident Fund) maturity amount, interest earned, and year-by-year balance over the 15-year lock-in period. Free PPF Calculator — 100% client-side.',
  },
  'sip-stepup-calculator': {
    description: 'Calculate returns on a SIP with annual step-up (top-up) contributions and visualize corpus growth with a detailed year-by-year chart. Free SIP Step-Up Calculator — 100% client-side.',
  },
  'fd-calculator-india': {
    description: 'Calculate Fixed Deposit maturity amount and interest for any tenure, principal, and interest rate — with quarterly compounding. Free FD Calculator India — 100% client-side.',
  },
  'gratuity-calculator-india': {
    description: 'Calculate gratuity entitlement under the Payment of Gratuity Act 1972 based on last drawn salary and years of service. Free Gratuity Calculator India — 100% client-side.',
  },
  'nps-calculator-india': {
    description: 'Calculate your NPS (National Pension System) corpus at retirement and monthly pension estimate based on contributions and expected returns. Free NPS Calculator India — 100% client-side.',
  },
  'vat-calculator': {
    description: 'Add or remove VAT from any price at standard, reduced, or custom rates. Free VAT Calculator — 100% client-side, supports UK, EU, and custom VAT rates.',
  },
  'freelance-rate-calculator': {
    description: 'Calculate your minimum viable freelance hourly or daily rate based on target income, working days, and expenses. Free Freelance Rate Calculator — 100% client-side, your financials stay private.',
  },
  'roi-calculator': {
    description: 'Calculate Return on Investment (ROI), annualised return, and break-even period for any investment or business decision. Free ROI Calculator — instant results, 100% client-side.',
  },
  'markup-vs-margin': {
    description: 'Understand the difference between markup and margin and convert between them instantly. Free Markup vs Margin Calculator — 100% client-side, essential for pricing strategy.',
  },
  'car-loan-emi-calculator-india': {
    description: 'Calculate car loan EMI, total interest, and repayment schedule for Indian vehicle financing with down payment support. Free Car Loan EMI Calculator India — 100% client-side.',
  },
  'home-loan-calculator-india': {
    description: 'Calculate home loan EMI, total interest payable, and full amortization schedule for Indian home loans under PMAY and regular rates. Free Home Loan Calculator India — 100% client-side.',
  },
  'income-tax-calculator-india': {
    description: 'Calculate income tax liability for salaried individuals in India under Old and New Regime for FY 2024-25 with deductions and rebates. Free Income Tax Calculator India — 100% client-side.',
  },
  'sip-calculator-india': {
    description: 'Calculate the future value of your monthly SIP investments in Indian mutual funds with XIRR-based return estimates. Free SIP Calculator India — 100% client-side, investor data stays private.',
  },
  // ─── Geo Tools ────────────────────────────────────────────────────────────
  'distance-calculator': {
    description: 'Calculate the straight-line distance between any two cities or geographic coordinates using the Haversine formula. Free Distance Calculator — 100% client-side, results in km, miles, and nautical miles.',
  },
  'coordinate-converter': {
    description: 'Convert geographic coordinates between Decimal Degrees (DD), Degrees-Minutes-Seconds (DMS), and UTM formats. Free Coordinate Converter — 100% client-side, ideal for GIS and mapping workflows.',
  },
  'ip-geolocation': {
    description: 'Look up the geographic location, ISP, timezone, and ASN for any IP address in seconds. Free IP Geolocation Tool — instant results, no sign-up required.',
  },
  'world-clock': {
    description: 'View the current time across multiple timezones simultaneously with DST awareness. Free World Clock — 100% client-side, live updates, add any city or timezone instantly.',
  },
  'sunrise-sunset': {
    description: 'Look up accurate sunrise, sunset, dawn, dusk, and solar noon times for any location and date. Free Sunrise Sunset Calculator — 100% client-side, no sign-up required.',
  },
  'country-info': {
    description: 'Look up country details — capital, population, currency, languages, time zones, and calling code — in one click. Free Country Info Tool — 100% client-side, no sign-up required.',
  },
  'lat-long-finder': {
    description: 'Find the latitude and longitude coordinates for any place name, address, or landmark using reverse geocoding. Free Latitude Longitude Finder — instant lookup, no sign-up required.',
  },
  // ─── Fintech ─────────────────────────────────────────────────────────────
  'timezone-converter': {
    description: 'Convert time between any two timezones with DST awareness and a world map reference. Free Timezone Converter — 100% client-side, supports 500+ IANA timezones.',
  },
  // ─── Design ──────────────────────────────────────────────────────────────
  'font-pair-suggester': {
    description: 'Get curated font pairing suggestions for your design project with live preview of headings and body text from Google Fonts. Free Font Pair Suggester — 100% client-side, no sign-up required.',
  },
  'responsive-checker': {
    description: 'Preview how any URL looks across multiple device viewports — mobile, tablet, and desktop — simultaneously. Free Responsive Design Checker — instant preview, no sign-up required.',
  },
  'css-gradient-generator': {
    description: 'Create and customize CSS gradients (linear, radial, conic) with a visual editor and copy the CSS output instantly. Free CSS Gradient Generator — 100% client-side, no sign-up required.',
  },
  'pixel-to-rem': {
    description: 'Convert pixel values to rem and em units based on your base font size for accessible, scalable CSS. Free Pixel to REM/EM Converter — 100% client-side, instant results.',
  },
  'box-shadow-generator': {
    description: 'Design box shadows visually with controls for offset, blur, spread, and color, then copy the CSS. Free Box Shadow Generator — 100% client-side, no sign-up required.',
  },
  'border-radius-generator': {
    description: 'Generate CSS border-radius values for any shape — rounded corners, circles, and pill shapes — with visual preview. Free Border Radius Generator — 100% client-side.',
  },
  'color-shades-generator': {
    description: 'Generate tints and shades from any base color for a complete design system color palette. Free Color Shades Generator — 100% client-side, outputs HEX, RGB and CSS variables.',
  },
  'glassmorphism-generator': {
    description: 'Design glassmorphism UI cards with backdrop blur, opacity, and border controls, then copy the CSS. Free Glassmorphism Generator — 100% client-side, live preview, no sign-up required.',
  },
};

// Geographic targeting: India-specific tools for structured data
const INDIA_SPECIFIC_TOOLS = [
  'tax-calculator-india',
  'salary-calculator',
  'investment-comparator',
  'gold-silver-calculator',
  'retirement-calculator',
  'capital-gains-tax',
  'gst-calculator-india',
  'ppf-calculator',
  'sip-stepup-calculator',
  'fd-calculator-india',
  'gratuity-calculator-india',
  'nps-calculator-india',
  'car-loan-emi-calculator-india',
  'home-loan-calculator-india',
  'income-tax-calculator-india',
  'sip-calculator-india',
] as const;

function buildToolOgUrl(name: string, categoryKey: string): string {
  const cat = TOOL_CATEGORIES[categoryKey as keyof typeof TOOL_CATEGORIES];
  const params = new URLSearchParams({ name, category: categoryKey });
  if (cat?.name) params.set('label', cat.name);
  if (cat?.color) params.set('color', cat.color);
  return `https://codelithlabs.in/api/og?${params.toString()}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC PARAMS - Pre-generate all tool routes at build time
// ═══════════════════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ═══════════════════════════════════════════════════════════════════════════
// METADATA - Dynamic SEO for each tool
// ═══════════════════════════════════════════════════════════════════════════

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found - CodelithLabs',
      description: 'The requested tool could not be found.'
    };
  }

  const category = TOOL_CATEGORIES[tool.category];
  const shouldIndex = isToolIndexable(tool);
  const seoDescription = TOOL_SEO_OVERRIDES[tool.slug]?.description ?? tool.description;
  const canonicalUrl = `https://codelithlabs.in/tools/${tool.slug}/`;
  const ogImageUrl = buildToolOgUrl(tool.name, tool.category);

  return {
    title: `${tool.name} - Free Online Tool | CodelithLabs`,
    description: seoDescription,
    keywords: [...tool.keywords, category.name, 'online tool', 'free', 'codelithlabs'].join(', '),
    openGraph: {
      title: `${tool.name} | CodelithLabs Tools`,
      description: seoDescription,
      url: canonicalUrl,
      type: 'website',
      siteName: 'CodelithLabs',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.name} by CodelithLabs`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: seoDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  // Show 404 if tool doesn't exist
  if (!tool) {
    notFound();
  }

  const category = TOOL_CATEGORIES[tool.category];
  const relatedTools = getRelatedTools(slug, 4);
  const content = await getToolContent(slug);
  const seoDescription = TOOL_SEO_OVERRIDES[tool.slug]?.description ?? tool.description;
  const canonicalUrl = `https://codelithlabs.in/tools/${tool.slug}/`;
  const ogImageUrl = buildToolOgUrl(tool.name, tool.category);
  const isIndiaSpecific = INDIA_SPECIFIC_TOOLS.includes(slug as any);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: seoDescription,
    applicationCategory: category.name,
    operatingSystem: "Any",
    image: ogImageUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    isAccessibleForFree: true,
    url: canonicalUrl,
    ...(content?.frontmatter.datePublished && { datePublished: content.frontmatter.datePublished }),
    ...(content?.frontmatter.dateModified && { dateModified: content.frontmatter.dateModified }),
    ...(isIndiaSpecific && { availableInCountry: "IN" }),
  };

  const genericFaqs = [
    { question: `Is ${tool.name} really free?`, answer: "Yes! All tools on CodelithLabs are 100% free with no hidden costs, premium tiers, or usage limits." },
    { question: `Does ${tool.name} store my data?`, answer: "No. All processing happens in your browser. We never see, store, or transmit your data to any server." },
    { question: `Does ${tool.name} work offline?`, answer: tool.processingType === 'client' ? "Yes, once the page is loaded, the tool works offline since all processing is client-side." : "This tool requires a server connection for processing." },
    { question: `Is ${tool.name} secure to use?`, answer: "Yes. Your data never leaves your browser — all processing happens client-side with zero server transmission. We use HTTPS encryption for the site itself." },
    { question: "What browsers are supported?", answer: "All modern browsers are fully supported: Chrome, Firefox, Safari, Edge, and Opera. Mobile browsers work perfectly too." },
  ];
  const faqEntries = content?.faq?.length
    ? [...content.faq, ...genericFaqs]
    : genericFaqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codelithlabs.in" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://codelithlabs.in/tools/" },
      { "@type": "ListItem", position: 3, name: category.name, item: `https://codelithlabs.in/tools/category/${tool.category}/` },
      { "@type": "ListItem", position: 4, name: tool.name, item: `https://codelithlabs.in/tools/${tool.slug}/` }
    ]
  };

  return (
    <>
      {/* Software Application schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {/* FAQ schema for rich results and CTR */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Breadcrumb schema for structured navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolLayout tool={tool} content={content} slug={slug}>
        <ToolMapper slug={slug} toolName={tool.name} />
      </ToolLayout>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Related Tools
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map(related => {
              const relCat = TOOL_CATEGORIES[related.category];
              return (
                <Link
                  key={related.slug}
                  href={`/tools/${related.slug}`}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50
                             hover:border-blue-500/50 hover:bg-zinc-900 transition-all group"
                >
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{
                      backgroundColor: `${relCat.color}15`,
                      color: relCat.color,
                      border: `1px solid ${relCat.color}30`
                    }}
                  >
                    {relCat.name}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mt-2">
                    {related.name}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{related.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
