import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import {
  PLANNER_PROMPT,
  GENERATOR_PROMPT,
  EXPLAINER_PROMPT,
} from "@/lib/prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/* ---------------------------------- */
/* 🔥 DETERMINISTIC REMOVAL ENGINE    */
/* ---------------------------------- */
function removeByLabel(planObj: any, labelToRemove: string) {
  const target = labelToRemove.toLowerCase().trim();

  planObj.components = planObj.components.map((comp: any) => {
    if (!comp.children) return comp;

    comp.children = comp.children.filter((child: any) => {
      if (child.type !== "Button") return true;

      const label = (child.props?.label || "")
        .toLowerCase()
        .trim();

      return label !== target;
    });

    return comp;
  });

  return planObj;
}

export async function POST(req: Request) {
  try {
    const { userInput, previousPlan } = await req.json();

    if (!userInput) {
      return NextResponse.json(
        { error: "userInput is required" },
        { status: 400 }
      );
    }

    const lower = userInput.toLowerCase();
    const hasPreviousPlan =
      previousPlan &&
      typeof previousPlan === "object" &&
      Object.keys(previousPlan).length > 0;

    let planObj;

    /* ---------------------------------- */
    /* 🔥 REMOVE FLOW (NO LLM)            */
    /* ---------------------------------- */
    if (
      hasPreviousPlan &&
      (lower.startsWith("remove") || lower.startsWith("delete"))
    ) {
      const labelToRemove = lower
  .replace("remove", "")
  .replace("delete", "")
  .trim();


      planObj = removeByLabel(
        JSON.parse(JSON.stringify(previousPlan)),
        labelToRemove
      );
    }

    /* ---------------------------------- */
    /* 🔥 PLANNER FLOW                    */
    /* ---------------------------------- */
    else {
      const plannerResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        messages: [
          { role: "system", content: PLANNER_PROMPT },
          {
            role: "user",
            content: hasPreviousPlan
              ? `Previous Plan:
${JSON.stringify(previousPlan, null, 2)}

User Request:
${userInput}

Modify existing JSON.
Preserve unchanged components.
Return FULL updated JSON.
Return ONLY JSON.`
              : userInput,
          },
        ],
      });

      let plan =
        plannerResponse.choices[0]?.message?.content || "";

      plan = plan
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const firstBrace = plan.indexOf("{");
      const lastBrace = plan.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("Invalid JSON returned from planner");
      }

      plan = plan.substring(firstBrace, lastBrace + 1);
      planObj = JSON.parse(plan);
    }

    const finalPlan = JSON.stringify(planObj, null, 2);

    /* ---------------------------------- */
    /* 🔥 GENERATOR                       */
    /* ---------------------------------- */
    const generatorResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        { role: "system", content: GENERATOR_PROMPT },
        { role: "user", content: finalPlan },
      ],
    });

    const code =
      generatorResponse.choices[0]?.message?.content || "";

    /* ---------------------------------- */
    /* 🔥 EXPLAINER                       */
    /* ---------------------------------- */
    const explainerResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        { role: "system", content: EXPLAINER_PROMPT },
        { role: "user", content: finalPlan },
      ],
    });

    const explanation =
      explainerResponse.choices[0]?.message?.content || "";

    return NextResponse.json({
      plan: finalPlan,
      code,
      explanation,
    });

  } catch (error: any) {
    console.error("AGENT CRASH:", error);

    return NextResponse.json(
      { error: error.message || "Agent failed" },
      { status: 500 }
    );
  }
}
