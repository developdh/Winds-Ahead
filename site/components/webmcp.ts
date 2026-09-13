"use client";
import { useEffect, useRef } from "react";
import { cosmetics, nameOf, searchCosmetics, type Locale } from "@/lib/catalog";
interface Tool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
}
interface Context {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
}
export function useArchiveTools(
  l: Locale,
  saved: string[],
  save: (id: string, wanted: boolean) => boolean,
) {
  const state = useRef({ l, saved, save });
  useEffect(() => {
    state.current = { l, saved, save };
  }, [l, saved, save]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tools: Tool[] = [
      {
        name: "search_cosmetics",
        title: "Search cosmetics",
        description:
          "Find cosmetics in this archive by original name, provisional name, or visual description. Does not change the page or claim global release dates.",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string", maxLength: 200 } },
          required: ["query"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute(input) {
          if (
            !input ||
            typeof input !== "object" ||
            Object.keys(input).some((k) => k !== "query") ||
            typeof (input as { query?: unknown }).query !== "string" ||
            (input as { query: string }).query.length > 200
          )
            throw new Error(
              "Provide only a query string of at most 200 characters",
            );
          return searchCosmetics((input as { query: string }).query).map(
            (c) => ({
              id: c.id,
              name: nameOf(c, state.current.l),
              originalName: c.nameOriginal,
              url: `/${state.current.l}/cosmetics/${c.id}`,
            }),
          );
        },
      },
      {
        name: "read_watchlist",
        title: "Read watchlist",
        description:
          "Read cosmetic IDs saved in this browser. No server account or cross-device synchronization.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          if (!input || typeof input !== "object" || Object.keys(input).length)
            throw new Error("Provide an empty object");
          return { cosmeticIds: state.current.saved };
        },
      },
      {
        name: "set_watchlist",
        title: "Save or remove a cosmetic",
        description:
          "Save or remove one existing cosmetic using the visible bookmark action. Changes this browser’s watchlist only.",
        inputSchema: {
          type: "object",
          properties: {
            cosmeticId: { type: "string", enum: cosmetics.map((c) => c.id) },
            saved: { type: "boolean" },
          },
          required: ["cosmeticId", "saved"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          if (
            !input ||
            typeof input !== "object" ||
            Object.keys(input).some((k) => !["cosmeticId", "saved"].includes(k))
          )
            throw new Error("Provide cosmeticId and saved only");
          const data = input as { cosmeticId?: unknown; saved?: unknown };
          if (
            typeof data.cosmeticId !== "string" ||
            !cosmetics.some((c) => c.id === data.cosmeticId) ||
            typeof data.saved !== "boolean"
          )
            throw new Error("Unknown cosmetic or invalid saved value");
          state.current.save(data.cosmeticId, data.saved);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
          return { cosmeticId: data.cosmeticId, saved: data.saved };
        },
      },
    ];
    for (const tool of tools) {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => console.warn(`Could not register ${tool.name}`));
      } catch {
        console.warn(`Could not register ${tool.name}`);
      }
    }
    return () => lifecycle.abort();
  }, []);
}
