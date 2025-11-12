import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all recipes with optional search, filter, and sort
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const sort = searchParams.get("sort");

    const where: any = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (tag) {
      where.tags = {
        contains: tag,
        mode: "insensitive",
      };
    }

    const orderBy: any = {};
    if (sort === "asc") {
      orderBy.title = "asc";
    } else if (sort === "desc") {
      orderBy.title = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy,
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Always return an array, even on error
    return NextResponse.json([], { status: 500 });
  }
}

// POST create new recipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, ingredients, tags, imageUrl } = body;

    if (!title || !ingredients) {
      return NextResponse.json(
        { error: "Title and ingredients are required" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        tags: tags || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
