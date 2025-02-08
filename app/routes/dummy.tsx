import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { parse } from "cookie"; // Import a safer way to parse cookies

// Loader function to fetch the cookie
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get the cookie header from the request
  const cookieHeader = request.headers.get("Cookie");

  // Parse cookies safely using "cookie" package
  const cookies = cookieHeader ? parse(cookieHeader) : {};       

  // Extract the "__FlowTune_Token" cookie
  const token = cookies["__FlowTune_Token_server"] ?? "";

  // Return the token to the frontend
  return json({ token });
};

// Dummy Page Component
export default function DummyPage() {
  // Fetch token using useLoaderData
  const { token } = useLoaderData<typeof loader>();

  console.log(token);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Dummy Page</h1>
      <p className="mt-4 text-lg">
        <strong>Token:</strong> {token ? token : "No token found"}
      </p>
    </div>
  );
}
