"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SUGGESTED_TAGS = [
  "Vegan",
  "Dessert",
  "Quick",
  "Gluten-Free",
  "Healthy",
  "Breakfast",
  "Comfort Food",
];

export default function NewRecipe() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageValid, setImageValid] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    tags: "",
    imageUrl: "",
  });

  const tagChips = useMemo(
    () =>
      formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [formData.tags]
  );

  const handleTagSelect = (tag: string) => {
    if (tagChips.includes(tag)) return;
    const tags = [...tagChips, tag].join(", ");
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = formData.title.trim();
    const trimmedIngredients = formData.ingredients.trim();

    if (!trimmedTitle || !trimmedIngredients) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          ingredients: trimmedIngredients,
          tags: formData.tags.trim() || null,
          imageUrl: formData.imageUrl.trim() || null,
        }),
      });

      if (response.ok) {
        router.push("/?status=created");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save recipe. Please try again.");
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
      setError("Unexpected error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--color-background)">
      <header className="border-b border-(--color-border) bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-(--color-border) px-4 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#f5f5f5]"
          >
            ← Back to recipes
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-(--shadow-card)">
          <div className="flex flex-col gap-2 pb-6">
            <span className="inline-flex w-max rounded-full bg-(--color-secondary) px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a5a2c]">
              New recipe
            </span>
            <h1 className="text-3xl font-semibold text-[#333333]">
              Document your signature dish
            </h1>
            <p className="text-sm text-(--color-muted)">
              Share the story, ingredients, and flavors of your favorite
              creation.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-[#ffd8bd] bg-[#fff4eb] px-4 py-3 text-sm font-medium text-[#9a5a2c]">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#333333]">
                  Title <span className="text-[#d14343]">*</span>
                </span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g., Caramelized Orange Tart"
                  className="rounded-2xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm shadow-inner focus:border-(--color-primary) focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#333333]">
                  Tags <span className="text-(--color-muted)">(optional)</span>
                </span>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="Try: Vegan, Dinner, Comfort Food"
                  className="rounded-2xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm shadow-inner focus:border-(--color-primary) focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      className="rounded-full bg-(--color-secondary) px-3 py-1 text-xs font-semibold text-[#9a5a2c] transition hover:bg-[#ffd9a0]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[#333333]">
                Ingredients <span className="text-[#d14343]">*</span>
              </span>
              <textarea
                rows={8}
                value={formData.ingredients}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    ingredients: event.target.value,
                  }))
                }
                placeholder={
                  "One ingredient per line\n2 cups flour\n1 cup sugar\nZest of 1 lemon"
                }
                className="rounded-3xl border border-(--color-border) bg-(--color-background) px-4 py-4 text-sm leading-relaxed shadow-inner focus:border-(--color-primary) focus:outline-none"
              />
              <span className="text-xs text-(--color-muted)">
                Tip: include measurements and preparation notes for clarity.
              </span>
            </label>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#333333]">
                  Image URL{" "}
                  <span className="text-(--color-muted)">(optional)</span>
                </span>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFormData((prev) => ({ ...prev, imageUrl: value }));
                    setImageValid(true);
                  }}
                  placeholder="https://your-image-source.com/recipe.jpg"
                  className="rounded-2xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm shadow-inner focus:border-(--color-primary) focus:outline-none"
                />
                <span className="text-xs text-(--color-muted)">
                  Paste a direct link to the dish photo.
                </span>
              </label>

              <div className="flex items-center justify-center rounded-3xl border border-dashed border-(--color-border) bg-(--color-background) p-4 text-center">
                {formData.imageUrl && imageValid ? (
                  <img
                    src={formData.imageUrl}
                    alt="Recipe preview"
                    className="h-40 w-full rounded-2xl object-cover"
                    onError={() => setImageValid(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-sm text-(--color-muted)">
                    <span className="text-3xl">📷</span>
                    <span>Preview appears here</span>
                    {!imageValid && (
                      <span className="text-xs text-[#d14343]">
                        Image could not be loaded.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-(--color-border) px-5 py-3 text-sm font-semibold text-[#333333] transition hover:bg-[#f5f5f5]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:bg-opacity-60"
              >
                {loading ? "Saving..." : "Save recipe"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
