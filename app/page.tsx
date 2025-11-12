"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  tags: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

function HomeContent() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedTag) params.append("tag", selectedTag);
      if (sortOrder) params.append("sort", sortOrder);

      const response = await fetch(`/api/recipes?${params.toString()}`);

      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", response.status, errorData);
        setRecipes([]);
        setToastMessage(
          errorData.error ||
            `Failed to load recipes (${response.status}). Please check your database connection.`
        );
        return;
      }

      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setRecipes(data);
      } else {
        console.error("API returned non-array data:", data);
        setRecipes([]);
        setToastMessage(data.error || "Failed to load recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
      setToastMessage(
        "Unable to load recipes right now. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [search, selectedTag, sortOrder]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (!status) return;

    const messages: Record<string, string> = {
      created: "Recipe saved successfully!",
      updated: "Recipe updated successfully!",
    };

    setToastMessage(messages[status] ?? "Action completed successfully!");

    const params = new URLSearchParams(searchParams);
    params.delete("status");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const confirmDelete = async () => {
    if (!modalRecipe) return;

    try {
      const response = await fetch(`/api/recipes/${modalRecipe.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToastMessage(`"${modalRecipe.title}" deleted successfully.`);
        setModalRecipe(null);
        fetchRecipes();
      } else {
        setToastMessage("Failed to delete recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setToastMessage("Unable to delete recipe right now.");
    }
  };

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(
          recipes
            .filter((r) => r.tags)
            .flatMap((r) => r.tags!.split(",").map((t) => t.trim()))
        )
      ),
    [recipes]
  );

  const renderIngredientPreview = (ingredients: string) => {
    const items = ingredients
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);

    return items.length ? (
      <ul className="space-y-1 text-sm text-[#555555]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <span className="mt-1 block h-1 w-1 flex-shrink-0 rounded-full bg-[rgba(51,51,51,0.4)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-[#555555]">No ingredients listed.</p>
    );
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-(--color-background)"
      suppressHydrationWarning
    >
      <header className="border-b border-(--color-border) bg-white/95 backdrop-blur">
        <div
          className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between"
          suppressHydrationWarning
        >
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <span className="text-3xl">🍳</span>
            <div suppressHydrationWarning>
              <Link
                href="/"
                className="text-2xl font-semibold text-(--color-primary)"
              >
                RecipeShare
              </Link>
              <p className="text-sm text-(--color-muted)">
                Discover and share recipes you love
              </p>
            </div>
          </div>
          <Link
            href="/recipes/new"
            className="flex items-center justify-center rounded-full bg-(--color-primary) px-6 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-(--color-primary-hover)"
          >
            + Add Recipe
          </Link>
        </div>
        <div
          className="border-t border-(--color-border) bg-white/90"
          suppressHydrationWarning
        >
          <div
            className="mx-auto grid w-full max-w-6xl gap-3 px-6 py-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]"
            suppressHydrationWarning
          >
            <div
              className="flex w-full items-center gap-3 rounded-full border border-(--color-border) bg-(--color-surface) px-4 shadow-sm shadow-[rgba(0,0,0,0.02)] focus-within:border-(--color-primary)"
              suppressHydrationWarning
            >
              <span className="text-lg text-(--color-muted)">🔍</span>
              <input
                type="text"
                placeholder="Search recipes by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm shadow-sm shadow-[rgba(0,0,0,0.02)] focus:border-(--color-primary) focus:outline-none"
            >
              <option value="">Filter by tag</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm shadow-sm shadow-[rgba(0,0,0,0.02)] focus:border-(--color-primary) focus:outline-none"
            >
              <option value="">Sort by title</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <div className="flex flex-col gap-2" suppressHydrationWarning>
          <h1 className="text-3xl font-semibold text-[#333333]">
            Your curated recipes
          </h1>
          <p className="text-sm text-(--color-muted)">
            Browse, edit, or create flavorful dishes that inspire.
          </p>
        </div>

        {loading ? (
          <div
            className="flex flex-1 items-center justify-center"
            suppressHydrationWarning
          >
            <div
              className="flex flex-col items-center gap-3"
              suppressHydrationWarning
            >
              <div
                className="h-12 w-12 animate-spin rounded-full border-2 border-(--color-secondary) border-t-transparent"
                suppressHydrationWarning
              ></div>
              <p className="text-sm text-(--color-muted)">Loading recipes...</p>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="max-w-md rounded-3xl border border-dashed border-(--color-border) bg-white px-10 py-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-[#333333]">
                No recipes yet — let’s add your first one!
              </p>
              <p className="mt-2 text-sm text-(--color-muted)">
                Start by adding a recipe. Share ingredients, tags, and a photo
                to inspire others.
              </p>
              <Link
                href="/recipes/new"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-(--color-primary) px-6 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-(--color-primary-hover)"
              >
                Create a recipe
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-(--shadow-card) transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-(--color-secondary) text-5xl">
                      �️
                    </div>
                  )}
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-sm font-semibold text-(--color-primary) shadow-sm backdrop-blur transition hover:bg-white"
                      aria-label={`Edit ${recipe.title}`}
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setModalRecipe(recipe)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/90 text-sm font-semibold text-[#d14343] shadow-sm backdrop-blur transition hover:bg-white"
                      aria-label={`Delete ${recipe.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 py-5">
                  <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="text-lg font-semibold text-[#333333] transition hover:text-(--color-primary)"
                  >
                    {recipe.title}
                  </Link>

                  <div className="flex flex-wrap gap-2">
                    {recipe.tags?.split(",").map((tag) => (
                      <span
                        key={`${recipe.id}-${tag.trim()}`}
                        className="rounded-full bg-(--color-secondary) px-3 py-1 text-xs font-semibold text-[#9a5a2c]"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1 rounded-2xl bg-[#fdf7f2] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#c0703b]">
                      Key ingredients
                    </p>
                    <div className="mt-2">
                      {renderIngredientPreview(recipe.ingredients)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-(--color-muted)">
                    <span>
                      Created {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated {new Date(recipe.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-(--color-border) bg-white/80">
        <div
          className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-(--color-muted) sm:flex-row sm:items-center sm:justify-between"
          suppressHydrationWarning
        >
          <span>© 2024 RecipeShare. Crafted with flavour.</span>
          <span>Keep cooking, keep sharing.</span>
        </div>
      </footer>

      {toastMessage && (
        <div className="fixed bottom-8 right-6 z-40">
          <div className="rounded-2xl border border-(--color-secondary) bg-white px-5 py-3 text-sm font-medium text-[#9a5a2c] shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      {modalRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">🗑️</span>
              <div>
                <h2 className="text-xl font-semibold text-[#333333]">
                  Delete Recipe
                </h2>
                <p className="text-sm text-(--color-muted)">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-[#555555]">
              Are you sure you want to delete "{modalRecipe.title}"?
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setModalRecipe(null)}
                className="inline-flex items-center justify-center rounded-full border border-(--color-border) px-5 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center justify-center rounded-full bg-[#d14343] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b53a3a]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
