type Item = { title: string; body: string };
export type Content = { heading: string; intro: string; benefits: Item[]; steps: Item[]; faqs: Item[] };

export const CONTENT: Record<"link" | "emoji" | "pdf" | "qr" | "scan", Content> = {
  link: {
    heading: "Engineered for maximum click-through rates and complete redirect control.",
    intro: "1kb.link is a high-performance URL shortener and dynamic link management platform. Convert long, complex URLs into concise, branded addresses with instant sub-25ms global redirection, built-in analytics, and advanced link protections.",
    benefits: [
      {
        title: "Clean, Branded Addresses",
        body: "Eliminate broken link wrapping across SMS, Instagram bios, presentation slides, and marketing emails with compact, readable links.",
      },
      {
        title: "Advanced Link Controls",
        body: "Unlock custom back-half endings (slugs), password protection, automatic link expiration, and automated UTM campaign parameter builders on free sign up.",
      },
      {
        title: "Real-Time Traffic Intelligence",
        body: "Track visitor volumes, geographic click locations, referrer domains, and operating systems in real time without complex analytics dashboards.",
      },
    ],
    steps: [
      {
        title: "Input Target Destination",
        body: "Paste your long web address into the link generator for instant global shortening.",
      },
      {
        title: "Configure Advanced Options",
        body: "Optionally add a custom slug (1kb.link/yourbrand), passcode protection, or UTM parameters.",
      },
      {
        title: "Deploy and Monitor Clicks",
        body: "Distribute your short link with its auto-generated dynamic QR code and monitor live analytics.",
      },
    ],
    faqs: [
      {
        title: "What is 1kb.link and how does it work?",
        body: "1kb.link is an ultra-fast URL shortener that routes long destination links through global edge nodes. It reduces URL length, tracks engagement metrics, generates editable QR codes, and supports advanced password protections.",
      },
      {
        title: "Do I need an account to create short links?",
        body: "No account is required to generate standard short links and dynamic QR codes. Creating a free account unlocks advanced features including custom endings, passcode protection, link expiration dates, and UTM campaign tagging.",
      },
      {
        title: "Can I password-protect my short links?",
        body: "Yes. When password protection is enabled, visitors must enter a secret passcode before being redirected to the target destination. This protects sensitive documents, private betas, and exclusive product drops.",
      },
      {
        title: "Can I change the destination URL after creating a link?",
        body: "Yes. Destination URLs can be updated at any time from your dashboard without changing the short URL or reprinting any associated QR codes.",
      },
      {
        title: "Do links created on 1kb.link expire?",
        body: "Standard links remain active indefinitely. Registered users can optionally configure expiration dates or click limits to automatically shut down promotional links after campaigns conclude.",
      },
      {
        title: "What analytics metrics are tracked?",
        body: "1kb.link tracks total clicks, 14-day performance trends, country- and city-level geography, referring platforms (e.g. Twitter, LinkedIn), and visitor device types (iOS, Android, macOS, Windows).",
      },
    ],
  },

  emoji: {
    heading: "The world's most memorable web addresses: 1 single emoji per link.",
    intro: "1kb.link single-emoji links transform standard URLs into iconic visual identities like 1kb.link/🚀 or 1kb.link/🥑. Claim exclusive 1-character emoji addresses for a special launch price of $10 lifetime (originally $25) with dynamic QR codes and full geographic analytics.",
    benefits: [
      {
        title: "Instant Visual Recall",
        body: "A single emoji address like 1kb.link/🚀 captures attention instantly in social media bios, outdoor billboards, apparel, and video titles.",
      },
      {
        title: "Lifetime Ownership",
        body: "Register your single emoji link for just $10 lifetime with no recurring annual renewal fees, saving 60% off the standard $25 fee.",
      },
      {
        title: "Dynamic QR & Deep Tracking",
        body: "Every single emoji link includes a matching vector QR code, real-time conversion monitoring, city-level geographic insights, and device tracking.",
      },
    ],
    steps: [
      {
        title: "Search & Select Your Emoji",
        body: "Browse curated categories or search any single emoji character from your keyboard.",
      },
      {
        title: "Add to Cart & Set Destination",
        body: "Add one or multiple single emoji links to your cart and configure target URLs for each.",
      },
      {
        title: "Activate & Share Instantly",
        body: "Complete one-click registration to activate live global redirection, download QR codes, and inspect analytics.",
      },
    ],
    faqs: [
      {
        title: "How do single emoji short links work?",
        body: "A single emoji link is a URL where the path consists of exactly one emoji character, such as 1kb.link/🚀. When visitors navigate to the link or scan its dynamic QR code, our edge network resolves the emoji and redirects to your destination URL.",
      },
      {
        title: "How much does a single emoji link cost?",
        body: "Single emoji links are available for a one-time launch price of $10.00 USD lifetime (discounted from $25.00). You own the link with no recurring annual fees.",
      },
      {
        title: "Can one user buy multiple emoji links?",
        body: "Yes. Our multi-link cart system allows you to select multiple emoji links across different categories, assign custom destination URLs to each link, and checkout in a single seamless transaction.",
      },
      {
        title: "Do single emoji links work on all mobile devices and browsers?",
        body: "Yes. Single emoji links are fully supported across modern web browsers including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge on iOS, Android, macOS, and Windows. Dynamic QR codes provide universal fallback for offline and camera scanning.",
      },
      {
        title: "Can someone else claim my emoji after I purchase it?",
        body: "No. Each single emoji link is strictly exclusive. Once you claim an emoji (e.g. 1kb.link/💎), it is reserved exclusively for your designated destination URL for lifetime ownership.",
      },
    ],
  },

  pdf: {
    heading: "Permanent short links and dynamic QR codes for menus, brochures, and documents.",
    intro: "Host PDF menus, product catalogs, brochures, and price lists up to 25 MB with an instant short link and printable vector QR code. Update the underlying document anytime without reprinting physical flyers or table displays.",
    benefits: [
      {
        title: "Zero Hosting Infrastructure",
        body: "Upload your PDF file directly to 1kb.link. We provide fast global edge delivery without requiring website servers or cloud storage configuration.",
      },
      {
        title: "Optimized for Hospitality & Print",
        body: "Table tents, restaurant menus, conference badges, and product packaging open the PDF instantly in smartphone browser viewers with zero app downloads.",
      },
      {
        title: "Granular Document Engagement",
        body: "Monitor total document reads, daily peak scanning hours, and geographic reader distribution to measure campaign effectiveness.",
      },
    ],
    steps: [
      {
        title: "Select Your PDF",
        body: "Upload any PDF file up to 25 MB directly from your device.",
      },
      {
        title: "Obtain Short Link & QR",
        body: "1kb.link creates a branded short URL and customizable vector QR code pointing to the document.",
      },
      {
        title: "Print and Distribute",
        body: "Embed the QR code on flyers, table cards, or packaging for instant contactless viewing.",
      },
    ],
    faqs: [
      {
        title: "What is the maximum file size for PDF hosting?",
        body: "1kb.link supports PDF files up to 25 MB, accommodating high-resolution restaurant menus, multi-page brochures, event programs, and technical whitepapers.",
      },
      {
        title: "Can I replace the PDF document without changing the QR code?",
        body: "Yes. Because the QR code points to your short link, you can upload an updated version of your menu or brochure at any time while retaining the exact same printed QR code.",
      },
      {
        title: "Do mobile users need an app to open the PDF?",
        body: "No. Scanning the dynamic QR code opens the PDF directly in the device's native browser (Safari, Chrome) without requiring Adobe Acrobat or third-party viewer installations.",
      },
    ],
  },

  qr: {
    heading: "Dynamic vector QR codes that remain editable forever.",
    intro: "Traditional static QR codes break permanently if your URL changes or has a typo. Dynamic QR codes from 1kb.link route through your short link, allowing you to edit the destination anytime, customize ink/paper brand colors, and export in crisp SVG and PNG formats.",
    benefits: [
      {
        title: "Never Reprint Physical Assets",
        body: "Update your target website, promotion, or landing page anytime. Your printed signage, billboards, packaging, and business cards continue working seamlessly.",
      },
      {
        title: "High-Contrast Brand Styling",
        body: "Customize ink and background colors to match your brand palette while maintaining high optical contrast for 100% scan reliability.",
      },
      {
        title: "Scalable Vector SVG & PNG",
        body: "Download sharp PNG files for digital screens or infinite-resolution vector SVG files for commercial printing and large-format banners.",
      },
    ],
    steps: [
      {
        title: "Enter Web Destination",
        body: "Input the target URL or landing page you want your QR code to open.",
      },
      {
        title: "Customize Color Palette",
        body: "Choose ink and paper colors that complement your brand guidelines.",
      },
      {
        title: "Download PNG or SVG",
        body: "Export production-ready vector or high-resolution raster files for immediate deployment.",
      },
    ],
    faqs: [
      {
        title: "What is the difference between a dynamic and a static QR code?",
        body: "A static QR code hardcodes the final URL directly into the matrix pattern and cannot be edited once printed. A dynamic QR code encodes a 1kb.link short URL, enabling you to change the destination address anytime in the future without reprinting.",
      },
      {
        title: "Should I download PNG or SVG format?",
        body: "Use PNG for digital screens, email signatures, presentation slides, and website graphics. Use SVG (Scalable Vector Graphics) for printed packaging, storefront signs, and promotional flyers, as SVGs scale to any size without pixelation.",
      },
      {
        title: "Will custom colored QR codes scan reliably on older phones?",
        body: "Yes, as long as you maintain high visual contrast. We recommend pairing dark ink (black, navy, dark charcoal) with light paper (white, cream) to ensure 100% scanning accuracy across all camera sensors.",
      },
    ],
  },

  scan: {
    heading: "Fast, private in-browser QR code scanner with zero app installation.",
    intro: "Scan any QR code directly in your browser using your mobile or desktop camera. 1kb.link decodes URLs, contact details, Wi-Fi keys, and plain text locally on your device with complete privacy and zero data tracking.",
    benefits: [
      {
        title: "100% Private On-Device Processing",
        body: "Camera frames are processed entirely in local memory via HTML5 Canvas. No camera streams, pictures, or decoded data are ever sent to external servers.",
      },
      {
        title: "Instant Web Access",
        body: "Requires no App Store or Google Play downloads. Bookmark 1kb.link/scan on your phone's home screen for instantaneous access.",
      },
      {
        title: "Malicious Link Safety Previews",
        body: "Preview the decoded URL and domain before opening it, safeguarding your device against phishing attempts and unwanted redirects.",
      },
    ],
    steps: [
      {
        title: "Authorize Camera Access",
        body: "Grant browser permission to activate your front or rear camera.",
      },
      {
        title: "Frame the QR Code",
        body: "Align any QR code inside the viewfinder for instant automatic detection.",
      },
      {
        title: "Preview and Open",
        body: "Review the decoded link, copy the text to your clipboard, or navigate to the destination safely.",
      },
    ],
    faqs: [
      {
        title: "Is the QR code scanner free and private?",
        body: "Yes, the 1kb.link QR scanner is 100% free with no ads. Scanning happens entirely inside your browser's local sandbox, ensuring zero photos or scan history are recorded.",
      },
      {
        title: "What types of QR codes can this scanner read?",
        body: "The scanner supports all standard ISO/IEC QR codes including website URLs, plain text messages, Wi-Fi network credentials, email links, phone numbers, and vCard contact information.",
      },
      {
        title: "Which browsers are supported?",
        body: "Works on Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, and Opera on iOS, Android, macOS, Windows, and Linux devices equipped with a camera.",
      },
    ],
  },
};

