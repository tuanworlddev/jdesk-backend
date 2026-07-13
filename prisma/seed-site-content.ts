// Default interface content — the "full CMS" surface. Mirrors the current
// hard-coded site so switching the frontend to DB-driven changes nothing
// visually. Each key is one editable section in the admin panel.

export const SITE_CONTENT: Record<string, unknown> = {
  general: {
    siteName: "JDesk",
    tagline: "Desktop apps with a Java core and a web UI.",
    githubUrl: "https://github.com/tuanworlddev/jdesk",
    npmUrl: "https://www.npmjs.com/package/create-jdesk-app",
  },

  nav: {
    items: [
      { label: "Docs", href: "/docs" },
      { label: "Install", href: "/docs/installation" },
      { label: "Guides", href: "/docs/defining-commands" },
      { label: "Concepts", href: "/docs/architecture" },
    ],
    cta: { label: "Get started", href: "/docs/your-first-app" },
  },

  home: {
    hero: {
      eyebrow: "Java 25 core · System WebView · Open source",
      titleA: "Java core",
      titleB: "web UI",
      subtitle:
        "JDesk pairs a Java 25 application core with the operating system's own WebView — WebView2, WKWebView, WebKitGTK. The Tauri development model, without Rust, without bundled Chromium.",
      ctaPrimary: { label: "Build your first app", href: "/docs/your-first-app" },
      ctaSecondary: { label: "Read the introduction", href: "/docs/introduction" },
      command: "npm create jdesk-app@latest my-app",
    },
    why: {
      eyebrow: "Why JDesk",
      title: "The small-native trade-off, made for Java teams.",
      subtitle:
        "Keep business logic, system integration, lifecycle, and packaging in Java. Build the UI with React, Vue, Svelte, or plain HTML. Ship a small native app.",
    },
    pillars: [
      {
        icon: "browser",
        tone: "ember",
        title: "No bundled Chromium",
        body: "Render in the WebView already on the machine — WebView2, WKWebView, WebKitGTK. Apps stay small instead of shipping 100+ MB of browser.",
      },
      {
        icon: "cube",
        tone: "arc",
        title: "No Rust to learn",
        body: "Small binaries come from a trimmed JVM runtime image via jlink, not a new systems language. If your team knows Java and Gradle, you're ready.",
      },
      {
        icon: "bolt",
        tone: "ember",
        title: "No Node at runtime",
        body: "The frontend is static files served over the jdesk://app/ scheme. There is no local web server in production, and Node is only a build-time tool.",
      },
      {
        icon: "code",
        tone: "arc",
        title: "Compile-time typed IPC",
        body: "An annotation processor discovers @DesktopCommand methods and generates a typed TypeScript client. No runtime reflection, no glue that drifts.",
      },
      {
        icon: "shield",
        tone: "ember",
        title: "Secure by default",
        body: "Every command needs an explicit capability grant. Navigation is locked to the app origin, popups denied, path traversal rejected — enforced in Java.",
      },
      {
        icon: "package",
        tone: "arc",
        title: "Native packaging built in",
        body: "jlink + jpackage produce DMG/PKG, MSI/EXE, and DEB/RPM, each with SHA-256 checksums and a CycloneDX SBOM. Verified on real system WebViews.",
      },
    ],
    platforms: [
      { os: "Windows", webview: "WebView2 (Evergreen)", target: "Windows 10 1809+" },
      { os: "macOS", webview: "WKWebView", target: "macOS 13 Ventura+" },
      { os: "Linux", webview: "WebKitGTK 4.1", target: "Ubuntu 22.04+" },
    ],
    roundTrip: {
      eyebrow: "One round trip",
      title: "Call Java from the web. Get a typed record back.",
      intro:
        "Annotate a method with @DesktopCommand and JDesk generates a typed client for it. The frontend invokes; the handler runs on a virtual thread, off the UI thread; exactly one result crosses back — correlated by request id.",
      bullets: [
        "Deny-by-default capability check runs before your code.",
        "Handlers block freely on virtual threads — no async plumbing.",
        "The generated TypeScript client keeps types in sync at compile time.",
      ],
      link: { label: "Defining commands", href: "/docs/defining-commands" },
      javaFilename: "GreetingService.java",
      javaCode: `@DesktopCommand("greeting.greet")
@RequiresCapability("greeting:use")
public CompletionStage<Response> greet(Request req, InvocationContext ctx) {
    String name = req.name().isBlank() ? "world" : req.name().strip();
    return completedFuture(new Response("Hello, " + name + "!"));
}`,
      tsFilename: "ui/src/main.ts",
      tsCode: `import { commands } from "./jdesk-ts/commands";

// Fully typed — the argument and result come from your Java records.
const res = await commands.greeting.greet({ name: "Ada" });
result.textContent = res.message; // "Hello, Ada!"`,
    },
    comparison: {
      eyebrow: "How it compares",
      title: "Same trade-off as Tauri, in the language you already ship.",
      intro:
        "JDesk trades Electron's one-identical-engine guarantee for small apps on each platform's native WebView. If pixel-identical rendering everywhere is a hard requirement, Electron is still the safer choice.",
      rows: [
        { label: "Backend language", jdesk: "Java (JVM)", tauri: "Rust", electron: "Node.js" },
        { label: "Renderer", jdesk: "System WebView", tauri: "System WebView", electron: "Bundled Chromium" },
        { label: "Bundle size", jdesk: "Small (jlink runtime)", tauri: "Smallest", electron: "Large (100+ MB)" },
        { label: "Runtime dependency", jdesk: "Trimmed JVM (bundled)", tauri: "None", electron: "Bundled Chromium" },
        { label: "IPC", jdesk: "Compile-time typed", tauri: "Typed commands", electron: "IPC channels" },
        { label: "Best fit", jdesk: "Java / JVM teams", tauri: "Rust / native teams", electron: "Max web-parity" },
      ],
    },
    cta: {
      title: "Scaffold an app in one command.",
      subtitle:
        "Pick a template — basic, React, Vue, Svelte, or a structured multi-module layout — and run it on your OS.",
      command: "npx create-jdesk-app@latest my-app",
      ctaPrimary: { label: "Installation guide", href: "/docs/installation" },
      ctaSecondary: { label: "Browse the docs", href: "/docs" },
    },
  },

  footer: {
    tagline:
      "Desktop apps with a Java 25 core and a web UI, rendered by the operating system's own WebView. The Tauri model, without Rust.",
    columns: [
      {
        title: "Get started",
        links: [
          { label: "Introduction", href: "/docs/introduction" },
          { label: "Installation", href: "/docs/installation" },
          { label: "Your first app", href: "/docs/your-first-app" },
          { label: "Project structure", href: "/docs/project-structure" },
        ],
      },
      {
        title: "Guides",
        links: [
          { label: "Defining commands", href: "/docs/defining-commands" },
          { label: "Streaming binary data", href: "/docs/streaming-binary-data" },
          { label: "Serving assets", href: "/docs/serving-assets" },
          { label: "Packaging your app", href: "/docs/packaging" },
        ],
      },
      {
        title: "Concepts",
        links: [
          { label: "Architecture", href: "/docs/architecture" },
          { label: "How IPC works", href: "/docs/how-ipc-works" },
          { label: "Security model", href: "/docs/security-model" },
          { label: "Java API", href: "/docs/java-api" },
        ],
      },
    ],
    legal: "Apache-2.0 licensed. JDesk is open source and under active development.",
  },
};
