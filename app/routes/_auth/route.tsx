import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { Link, Outlet, useNavigate } from "@remix-run/react";
import { parse } from "cookie";
import { useEffect } from "react";
import { useCurrentUser } from "~/hooks/auth";
import GoogleSignInButton from "./_components/GoogleSigninButton";
import Divider from "./_components/Divider";
import FooterLinks from "./_components/FooterLinks";

// Loader function to check for the cookie
export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies["__FlowTune_Token_server"] ?? "";

  if (token) {
    return redirect("/");
  }

  return null;
};

export default function FtLayout() {
  const { data, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      // navigate("/", { replace: true });
    }
  }, [data]);

  if (isLoading || data) {
    return null;
  }

  console.log("again");
  

  return (
    <div className="min-h-screen h-full bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 -mt-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mt-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back To FlowTune</h2>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <GoogleSignInButton />
          <Divider />
          <div className="flex flex-col items-center">
            <Outlet />
          </div>
          <FooterLinks />
        </div>
      </div>
    </div>
  );
}
