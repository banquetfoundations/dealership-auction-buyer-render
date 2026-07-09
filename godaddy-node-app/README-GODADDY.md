# GoDaddy cPanel Application Manager Setup

Use this package with cPanel **Application Manager**.

## Register Application

- **Application root:** folder where you upload this package, for example `dealership-auction-buyer`
- **Application URL:** choose the domain/subdomain/path you want to use
- **Application startup file:** `app.js`
- **Node.js version:** 18 or newer, ideally 20+
- **Application mode:** Production

## Environment Variables

Add these in Application Manager:

```txt
OPENAI_API_KEY=your OpenAI API key
OPENAI_MODEL=gpt-5.5
```

Never put `OPENAI_API_KEY` inside `index.html`, `app.js`, or any browser file.

## After Saving

Restart the application in cPanel.

The app serves the prototype and exposes:

```txt
/api/research-comps
```

The browser app calls that endpoint when you click **Research verified comps**.
