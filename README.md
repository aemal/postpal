# 📬 PostPal

**PostPal** is a Chrome extension that helps you generate AI-assisted replies, reposts, and new posts on LinkedIn using ChatGPT. It's built with vibe coding energy — lightweight, fast to build, and fun to use.

---

## 🧑‍💻 User Stories

### 💬 Commenting User Story
As a LinkedIn professional, I want to quickly generate thoughtful comments on posts I find interesting, so I can engage meaningfully with my network without spending excessive time crafting responses.

### 🔁 Reposting User Story
As a content curator on LinkedIn, I want to share valuable posts with my network along with my personalized perspective, so I can provide context on why the content matters while saving time on writing.

### 📝 New Post User Story
As a LinkedIn content creator, I want to efficiently create original posts based on my ideas, so I can maintain an active presence and share insights without the mental burden of wordsmithing every post.

---

## ✨ Core UX Flows

### ✅ Use Case 1: Commenting on a Post

1. I see a LinkedIn post I want to respond to.
2. A **"💬 Answer with AI"** button is visible below the post (injected by the extension).
3. When I click it:
   - A prompt input box appears.
   - I write either a draft or a short instruction (e.g., "Write a supportive response").
4. The extension uses ChatGPT to generate a response based on the post's content and my instruction.
5. The result is auto-filled into the comment input box under the post.
6. I proofread, tweak if needed, and click **Comment**.

### 🔁 Use Case 2: Reposting with AI

1. I see a post I want to share.
2. A **"🔁 Repost with AI"** button appears next to the usual repost options.
3. When I click it:
   - A prompt input appears: "How should the repost text be written?"
   - I type something like: *"Summarize with excitement and mention its value for developers."*
4. A **LinkedIn repost window** opens, with the AI-generated caption pre-filled.
5. I proofread and click **Post**.

### 🆕 Use Case 3: New Post with AI

1. I click the extension icon in the Chrome toolbar or an inline **"📝 New Post with AI"** button.
2. A modal opens where I write instructions like *"Announce our new product update with enthusiasm".*
3. AI generates the post and injects it into the **new post modal** on LinkedIn.
4. I do final edits and click **Post**.

---

## 🔧 Full Stack Feature Summary

- Context-aware AI responses based on LinkedIn's DOM.
- Three modes: **Comment**, **Repost**, **New Post**.
- Backend API for ChatGPT generation via `/api/generate`.
- Chrome extension using **Manifest V3**, **content scripts**, and **popup UI**.
- Hot-reload dev setup with **Bun**, **Vite**, and **CRXJS**.
- Efficient DOM parsing to avoid performance hits.

---

## 📦 Project Structure

```bash
postpal/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── popup/
│   │   └── page.tsx
│   └── layout.tsx
├── public/
│   ├── icons/
│   ├── background.js
│   └── content.js
├── extension/
│   ├── background.ts
│   ├── content.ts
│   └── utils/
├── .env.local
├── manifest.json
├── bunfig.toml
├── next.config.js
└── README.md
```

---

## 🛠️ Dev Setup (with Hot Reload)

1. **Initialize Next.js project with Bun:**

```bash
bun create next postpal
cd postpal
bun install
```

2. **Develop extension pages using Next.js App Router.** Use `app/popup/page.tsx` for popup, and `app/api/generate/route.ts` for ChatGPT integration.

3. **Enable hot reload:**
- Use `next dev` for app routes.
- For content scripts, place them in `public/` and use manifest references.
- Reload the extension via Chrome DevTools automatically using a reloader plugin or manually.

4. **Link extension directory in Chrome:**
- Go to `chrome://extensions`
- Enable Developer Mode
- Load `postpal/public` as unpacked extension

> ✅ Since Next.js 15 supports Bun and full App Router, you get fast dev experience with server routes and integrated frontend logic.

---

## 📄 `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "PostPal",
  "version": "1.0",
  "description": "Generate AI-powered LinkedIn replies, reposts, and posts",
  "action": {
    "default_popup": "src/popup/index.html"
  },
  "background": {
    "service_worker": "src/background.ts"
  },
  "content_scripts": [
    {
      "matches": ["*://www.linkedin.com/*"],
      "js": ["src/content.ts"],
      "run_at": "document_idle"
    }
  ],
  "permissions": ["storage", "activeTab", "scripting"]
}
```

---

## 🧠 ChatGPT Integration

```ts
// pages/api/generate.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { context } = req.body

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Reply to this LinkedIn post: ${context}` }],
    }),
  })

  const data = await response.json()
  res.status(200).json({ reply: data.choices[0].message.content })
}
```

---

## 🔍 Context Extraction Logic

Your content script (`content.ts`) should:

- **Comment Use Case**:
  - Selectors: `.feed-shared-update-v2`, `.comments-comment-box__editor`
  - Extract post content nearby the comment input.

- **Repost Use Case**:
  - Extract text from the `.feed-shared-update-v2` and inject into the repost modal.

- **New Post Use Case**:
  - Trigger LinkedIn's native new post modal and inject generated text.

Each action displays a prompt input modal or overlay for user instruction, then inserts the AI response back into the LinkedIn UI.

---

## 🚀 Future Features

- Voice-to-prompt using Whisper.
- Tone adjustment sliders.
- Auto-save drafts.
- Prompt history and reuse.

---

## 🧑‍🎨 Credit
**PostPal** is built with the vibe coding spirit: *see stuff, say stuff, run stuff* — just vibes, powered by Next.js, Bun, and OpenAI.

---

## 📢 License
MIT. Build on it, remix it, make it yours!
