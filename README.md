# 🚀 AI UI Generator

### Deterministic LLM-Driven UI Builder (Planner → Generator → Explainer Architecture)

---

## 📌 Overview

AI UI Generator is a structured, deterministic UI generation system that converts natural language instructions into controlled React UI layouts using a strict component library.

Unlike typical AI UI tools that hallucinate HTML or break layouts, this system enforces architectural discipline using:

* 🔒 Component whitelist validation
* 🧠 Multi-agent architecture (Planner / Generator / Explainer)
* 🔁 Version control with rollback
* ⚙️ Deterministic backend modification logic
* 🛡️ Secure API key handling

---

## 🧠 Architecture

The system is built around three clearly separated agents:

---

### 1️⃣ Planner Agent (Structured JSON Designer)

The Planner converts user input into structured JSON using only approved components.

**Allowed Components:**

* Button
* Card
* Input
* Table
* Modal
* Sidebar
* Navbar
* Chart

**Planner Constraints:**

* No HTML elements
* No inline styles
* No hallucinated components
* Returns valid JSON only
* Preserves structure during modification

Example Planner Output:

```json
{
  "components": [
    {
      "type": "Card",
      "props": {},
      "children": [
        {
          "type": "Input",
          "props": { "placeholder": "Username" },
          "children": []
        },
        {
          "type": "Input",
          "props": { "placeholder": "Password" },
          "children": []
        },
        {
          "type": "Button",
          "props": { "label": "Login" },
          "children": []
        }
      ]
    }
  ]
}
```

---

### 2️⃣ Generator Agent (Strict JSX Compiler)

The Generator transforms structured JSON into valid JSX.

**Generator Restrictions:**

* Uses only approved components
* No wrapper divs
* No React.Fragment
* No new components
* No inline styles
* No HTML tags

This ensures:

* Clean output
* Predictable rendering
* Zero hallucinated layout wrappers

---

### 3️⃣ Explainer Agent (Transparent Reasoning Layer)

The Explainer describes:

* Why components were selected
* How layout was structured
* What changed during modification

This improves clarity and evaluation transparency.

---

## 🔁 Deterministic Modification System

Removal operations are handled server-side — not by the LLM.

When the user types:

```
remove register button
```

The backend:

* Searches components by label
* Matches case-insensitively
* Removes only exact matches
* Preserves the rest of the layout

This prevents:

* Over-removal
* Accidental layout destruction
* AI hallucinated deletions

---

## 🔄 Version Control

Each generation stores:

* Structured plan
* Generated JSX
* Explanation

Users can:

* Rollback to previous versions
* Continue modification from any state

This demonstrates state-aware UI evolution.

---

## 🛡️ Safety Layer

A validation system scans generated JSX and blocks:

* Unauthorized components
* HTML elements
* Hallucinated wrappers
* React imports
* Container / Layout components

Only the approved UI component library is allowed.

---

## 🏗 Tech Stack

* Next.js (App Router)
* TypeScript
* Groq (LLaMA 3.1 model)
* Custom deterministic backend logic
* Recursive JSON-based UI renderer
* Strict component validation

---


## 🧪 Example Workflow

1. create login form
2. add register button
3. remove register button
4. rollback to version 1

The system updates deterministically.

---

## 🎯 Key Engineering Strengths

✔ Deterministic architecture
✔ Strict component governance
✔ Safe LLM orchestration
✔ Backend-controlled modification
✔ Version-aware UI state
✔ No hallucinated layout elements
✔ Clean JSX generation

---

## 🏁 Conclusion

This project demonstrates how Large Language Models can be safely integrated into UI systems using:

* Structured constraints
* Deterministic safeguards
* Controlled component libraries
* Clear separation of responsibilities

It balances AI flexibility with production-level engineering discipline.

---

## 👤 Author

Developed as part of a Full Stack AI UI Generation assignment.

---


