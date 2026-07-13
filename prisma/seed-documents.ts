// Seed content for the documentation, stored as Markdown and editable in the
// admin panel. Content is intentionally concise starter copy drawn from the
// JDesk docs; expand any page in the admin editor.

export type SeedDoc = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  group: string;
  order: number;
  content: string;
  published: boolean;
};

const d = (
  slug: string,
  title: string,
  description: string,
  eyebrow: string,
  group: string,
  order: number,
  content: string,
): SeedDoc => ({
  slug,
  title,
  description,
  eyebrow,
  group,
  order,
  content: content.trim(),
  published: true,
});

export const DOCUMENTS: SeedDoc[] = [
  d(
    "introduction",
    "Introduction",
    "What JDesk is, why it exists, and how it compares to Tauri and Electron.",
    "Getting started",
    "Getting started",
    0,
    `
JDesk builds cross-platform desktop apps from a **Java 25 core** and a **web frontend**, rendered in the operating system's own WebView — WebView2 on Windows, WKWebView on macOS, WebKitGTK on Linux. A small, native app with no bundled browser and no Rust.

## The mental model

A JDesk app has three parts:

- **A Java core** — your commands, events, and application logic, on the JVM with virtual threads.
- **A web frontend** — HTML/CSS/JS built with any stack (React, Vue, Svelte, or none), running in the system WebView.
- **A platform adapter** — a per-OS module that creates the native window and WebView through Java's Foreign Function & Memory API.

The frontend calls Java by invoking **commands**; Java pushes data back by emitting **events**.

## Why JDesk exists

- **No bundled Chromium** — use the WebView already on the machine, so apps stay small.
- **No Rust** — small binaries come from a trimmed JVM runtime image via \`jlink\`.
- **No Node at runtime** — the frontend is static files served over \`jdesk://app/\`.
- **Type-safe IPC** — commands are discovered at compile time and generate a typed TypeScript client.
- **Secure by default** — every command requires an explicit capability grant.
`,
  ),
  d(
    "installation",
    "Installation",
    "Install the prerequisites and scaffold a project with create-jdesk-app.",
    "Getting started",
    "Getting started",
    1,
    `
## Prerequisites

- **JDK 25+** — required to scaffold, build, and run.
- **A system WebView** — WebView2 (Windows), WKWebView (macOS 13+), WebKitGTK 4.1 (Linux).
- **Node.js** — optional; only for Vite-based templates.

## Scaffold a project

\`\`\`bash
npm create jdesk-app@latest my-app
\`\`\`

Run it with no name for an interactive prompt (project name, template, Java package).

## Run the app

\`\`\`bash
cd my-app
./gradlew run
\`\`\`

On Windows use \`.\\gradlew.bat run\`. For hot reload: \`npm install --prefix ui && ./gradlew jdeskDev\`.
`,
  ),
  d(
    "your-first-app",
    "Your first app",
    "Scaffold a JDesk app and trace one command round trip end to end.",
    "Getting started",
    "Getting started",
    2,
    `
Scaffold from the default \`basic\` template, run it, and trace a round trip: a web page sends a name to a Java command, Java returns a typed record, and the page renders the reply.

## Read the command

\`\`\`java
@DesktopCommand("greeting.greet")
@RequiresCapability("greeting:use")
public CompletionStage<Response> greet(Request request, InvocationContext context) {
    String name = request.name() == null || request.name().isBlank()
            ? "world" : request.name().strip();
    return CompletableFuture.completedFuture(new Response("Hello, " + name + "!"));
}
\`\`\`

## The capability grant

\`\`\`json
{ "version": 1, "grants": [ { "capability": "greeting:use", "windows": ["main"] } ] }
\`\`\`

Clicking **Greet** works because the calling window holds the required capability.
`,
  ),
  d(
    "project-structure",
    "Project structure",
    "A file-by-file tour of the project that create-jdesk-app generates.",
    "Getting started",
    "Getting started",
    3,
    `
The default \`basic\` template is a single Gradle module.

\`\`\`text
my-app/
  build.gradle.kts               # plugin, deps, jdesk config
  src/main/java/.../Main.java     # entry point
  src/main/java/.../GreetingService.java
  src/main/resources/jdesk-capabilities.json
  ui/                            # the web frontend
\`\`\`

- **Main.java** builds a \`JDeskApplication\` with the command registry, capabilities, and a window.
- **GreetingService.java** is a command service turned into a registry at compile time.
- **jdesk-capabilities.json** grants capabilities per window (deny-by-default).

The \`structured\` template splits into \`domain\` / \`application\` / \`infrastructure\` / \`desktop\` modules.
`,
  ),

  d(
    "defining-commands",
    "Defining commands",
    "Declare a @DesktopCommand method and call it from the frontend.",
    "Guides",
    "Guides",
    0,
    `
Add a \`@DesktopCommand("area.name")\` method to a public service class. Every command must declare a capability decision — \`@RequiresCapability(...)\` or \`@PublicDesktopCommand\`.

\`\`\`java
@DesktopCommand("greeting.greet")
@RequiresCapability("greeting:use")
public CompletionStage<GreetResponse> greet(GreetRequest req, InvocationContext ctx) {
    return CompletableFuture.completedFuture(new GreetResponse("Hello, " + req.name()));
}
\`\`\`

Handlers run on a **virtual thread**, off the UI thread — just block for I/O. Do not wrap work in \`CompletableFuture.supplyAsync\`.

## Call it from JavaScript

\`\`\`ts
import { commands } from "./jdesk-ts/commands";
const response = await commands.greeting.greet({ name: "Tuan" });
\`\`\`
`,
  ),
  d(
    "emitting-events",
    "Emitting events",
    "Push data from Java to the frontend by emitting events.",
    "Guides",
    "Guides",
    1,
    `
Commands let the frontend call Java; **events** let Java push data back.

\`\`\`java
context.events().emit("download.progress", new Progress(pct));
\`\`\`

Subscribe on the JS side:

\`\`\`ts
import { on } from "jdesk-client";
const off = on("download.progress", (p) => { progressBar.value = p.pct; });
\`\`\`

Each window has a bounded queue (256 events). Overflow policy: \`REJECT\` (default), \`DROP_OLDEST\`, or \`COALESCE\`.
`,
  ),
  d(
    "streaming-binary-data",
    "Streaming binary data",
    "Return a BinaryStream and consume it with invokeStream — real backpressure.",
    "Guides",
    "Guides",
    2,
    `
Command results are JSON envelopes capped at 1 MiB. For files or exports, return a \`BinaryStream\` and consume it with \`invokeStream\` — a pull-based protocol with real backpressure. Verified live at 2 GiB on macOS.

\`\`\`ts
import { invokeStream } from "jdesk-client";
const result = await invokeStream("media.export", { id: 42 });
const reader = result.stream.getReader();
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  consume(value);
}
\`\`\`

Each \`read()\` issues one pull for up to \`chunkBytes\` (256 KiB max) — the runtime never sends data the page has not asked for.
`,
  ),
  d(
    "capabilities",
    "Capabilities & permissions",
    "Commands are deny-by-default. Grant capabilities to windows.",
    "Guides",
    "Guides",
    3,
    `
A window can invoke a command only if it holds the required capability.

\`\`\`java
@DesktopCommand("clipboard.read")
@RequiresCapability("clipboard:read")
public CompletionStage<Clip> read(InvocationContext ctx) { ... }
\`\`\`

Grant it in \`jdesk-capabilities.json\`:

\`\`\`json
{ "version": 1, "grants": [ { "capability": "clipboard:read", "windows": ["main"] } ] }
\`\`\`

The check runs **before** deserialization and before your handler. Grant each window only what it needs.
`,
  ),
  d(
    "serving-assets",
    "Serving assets",
    "In production JDesk serves your frontend over jdesk://app/ — no HTTP server.",
    "Guides",
    "Guides",
    4,
    `
A window's entry points at \`jdesk://app/\`. There is no localhost server in production; each platform adapter intercepts the scheme and resolves from an asset source (\`web/\` on the classpath).

A strict CSP is set on every response:

\`\`\`text
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
\`\`\`

The pipeline answers \`Range\` requests with \`206 Partial Content\` for large media. Register \`.assetRoute("prefix", handler)\` to serve Java-produced binary content directly.
`,
  ),
  d(
    "the-dev-loop",
    "The dev loop & HMR",
    "Frontend HMR in the WebView, plus automatic Java rebuild-and-restart.",
    "Guides",
    "Guides",
    5,
    `
Check your environment first:

\`\`\`bash
./gradlew jdeskDoctor
\`\`\`

Then start the loop (install frontend deps once for Vite templates):

\`\`\`bash
npm install --prefix ui
./gradlew jdeskDev
\`\`\`

Frontend edits hot-reload through Vite; Java changes rebuild and restart the app only after a successful compile. Configure reload in the \`development { }\` block.
`,
  ),
  d(
    "packaging",
    "Packaging your app",
    "Build a self-contained application image and installer with jlink + jpackage.",
    "Guides",
    "Guides",
    6,
    `
Build each package on its own OS — \`jpackage\` cannot cross-produce.

\`\`\`bash
./gradlew jdeskFrontendBuild   # 1. frontend -> ui/dist
./gradlew jdeskRuntimeImage    # 2. jlink trimmed runtime
./gradlew jdeskPackage         # 3. jpackage application image
./gradlew jdeskInstaller       # 4. native installer (DMG/MSI/DEB...)
\`\`\`

\`jdeskPackage\` also writes \`checksums.sha256\` and a CycloneDX SBOM. Installers are UNSIGNED without a signing identity.
`,
  ),
  d(
    "cli",
    "The CLI",
    "create-jdesk-app scaffolds projects; the jdesk CLI drives Gradle builds.",
    "Guides",
    "Guides",
    7,
    `
\`create-jdesk-app\` is a Node scaffolder around the Java generator.

\`\`\`bash
npx create-jdesk-app@latest my-app --template react --package com.acme.myapp
\`\`\`

Options: \`-t/--template\` (basic, vanilla, react, vue, svelte, structured), \`-p/--package\`, \`--jdesk-version\`, \`--jdesk-source\`, \`--force\`.

The bundled \`jdesk\` Java CLI also offers \`create\`, \`build\`, and \`bundle\`.
`,
  ),

  d(
    "architecture",
    "Architecture overview",
    "Modules, the request/response flow, and provider selection.",
    "Concepts",
    "Concepts",
    0,
    `
JDesk is built on Java 25 plus the OS WebView. Application logic runs on the JVM (JPMS modules, virtual threads, FFM); the UI is any static web build.

## The module map

- **jdesk-api** — the public Java API surface.
- **jdesk-runtime** — lifecycle, IPC protocol v1, capability engine, asset resolver.
- **jdesk-platform-*** — Windows/macOS/Linux WebView adapters.
- **jdesk-codegen** — the annotation processor (compile-time registration + TypeScript client).
- **jdesk-gradle-plugin** — dev loop, build, and packaging tasks.

## Provider selection

The runtime never scans the classpath. \`JDeskApplication.run()\` loads exactly one \`PlatformProvider\` via \`ServiceLoader\`; zero or many is a fatal error.
`,
  ),
  d(
    "how-ipc-works",
    "How IPC works",
    "Versioned JSON envelopes, the bridge, the nonce, and the invoke lifecycle.",
    "Concepts",
    "Concepts",
    1,
    `
Everything crossing the boundary is a string — a single JSON envelope with a version field. The frontend sends \`invoke\`; Java answers with exactly one \`result\`; Java pushes \`event\` envelopes.

The channel is \`window.__jdesk\` ("the bridge"), injected over each platform's native channel. Every \`invoke\` returns a Promise, answered later by a correlated \`result\`; handlers run on virtual threads.

Each navigation mints a fresh 128-bit nonce echoed in every envelope. The invoke lifecycle runs ordered checks: size, nonce, handshake, request-id, registry lookup, **capability (before deserialization)**, in-flight limit, deserialization, then the handler on a virtual thread.
`,
  ),
  d(
    "security-model",
    "Security model",
    "Why JDesk enforces its trust boundary in Java.",
    "Concepts",
    "Concepts",
    2,
    `
The single trust boundary is the **Java-side check on every invoke** — the frontend is never trusted to enforce anything.

- **Deny by default** — every command is classified at compile time; the capability engine evaluates before your code runs.
- **Origin & navigation locking** — production navigation is restricted to the app origin; popups are denied.
- **Strict CSP** — inline scripts and \`eval\` are blocked.
- **Asset path-traversal defenses** — paths are rejected, not repaired.
- **Error redaction** — handler exceptions become \`INTERNAL_ERROR\`; detail stays in Java logs.
`,
  ),

  d(
    "java-api",
    "Java API",
    "The public Java API surface of JDesk, module dev.jdesk.api.",
    "Reference",
    "Reference",
    0,
    `
Every type in \`dev.jdesk.api\` is dependency-free and stable.

- **JDeskApplication** — \`builder()\` with \`id\`, \`commands\`, \`capabilities\`, \`window\`, \`lifecycle\`, \`run(args)\`.
- **WindowConfig** — \`id\`, \`title\`, \`size\`, \`minSize\`, \`resizable\`, \`rememberBounds\`, \`entry\`.
- **@DesktopCommand / @RequiresCapability / @PublicDesktopCommand** — command annotations.
- **InvocationContext** — \`windowId\`, \`requestId\`, \`events()\`, \`isCancelled()\`.
- **EventEmitter** — \`emit(name, payload)\`.
- **UiDispatcher** — \`isUiThread\`, \`execute\`, \`submit\`, \`assertUiThread\`.
- **JDeskException / ErrorCode** — the only identifiers allowed across the boundary.
`,
  ),
];
