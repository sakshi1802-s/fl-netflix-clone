import { connectToDB } from "@/lib/db";
import Movie from "@/models/Movie";
import { NextResponse } from "next/server";
import serverAuth from "@/lib/serverAuth";

export async function GET() {
    try {
        await connectToDB();
        const movies = await Movie.find();
        console.log("Movies found in DB:", movies.length);
        console.log("First movie:", movies[0]);
        return NextResponse.json(movies, { status: 200 });
    } catch (error) {
        console.log("Error fetching movies:", error);
        return NextResponse.json(
            { message: "Failed to fetch movies" },
            { status: 500 }
        );
    }
}
     

// import { movies } from "@/utils/movies";

// export async function GET() {
//   return Response.json(movies);
// }
