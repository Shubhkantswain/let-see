// app/routes/ft.signin.tsx
import { Form, useActionData, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import SigninForm from "./_components/SigninForm";
import GeneralError from "../_auth/Components/GeneralError";
import SubmitButton from "../_auth/Components/SubmitButton";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createGraphqlClient } from "~/clients/api";
import { loginUserMutation } from "~/graphql/mutations/auth";
import { serialize } from "cookie";
import { useCurrentUser, useSetCookie } from "~/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";

interface ActionData {
    isLoginSuccess: boolean;
    authToken?: string;
    user?: {
        id: string
        email: string
        username: string
        fullName: string
        bio: string
        profileImageURL: string
    };
    errors?: {
        usernameOrEmail?: string;
        password?: string;
        general?: string;
    };
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const usernameOrEmail = formData.get("usernameOrEmail")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString().trim() ?? "";

    let errors: ActionData["errors"] = {};

    if (!usernameOrEmail) errors.usernameOrEmail = "Username Or Email is required.";
    if (!password) errors.password = "password is required.";

    if (Object.keys(errors).length > 0) {
        return json<ActionData>({ isLoginSuccess: false, errors }, { status: 400 });
    }

    try {
        const graphqlClient = createGraphqlClient();
        const { loginUser } = await graphqlClient.request(loginUserMutation, {
            input: { usernameOrEmail, password }
        });

        const cookie = serialize("__FlowTune_Token_server", loginUser?.authToken || "", {
            maxAge: 60 * 60 * 24, // 1 day
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "none",
        });

        return json<ActionData>({
            isLoginSuccess: true,
            authToken: loginUser?.authToken,
            user: {
                id: loginUser?.id || "",
                email: loginUser?.email || "",
                username: loginUser?.username || "",
                fullName: loginUser?.fullName || "",
                bio: loginUser?.bio || "",
                profileImageURL: loginUser?.profileImageURL || ""
            }

        });

    } catch (error: any) {
        return json<ActionData>(
            {
                isLoginSuccess: false,
                errors: {
                    general: error?.response?.errors?.[0]?.message || "Something went wrong"
                }
            },
            { status: 500 }
        );
    }
}

export default function SignIn() {
    const actionData = useActionData<ActionData>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const isLoginSuccessful = actionData?.isLoginSuccess;

    const { mutateAsync } = useSetCookie();
    const navigate = useNavigate();

    const queryClient = useQueryClient()

    useEffect(() => {
        if (isLoginSuccessful) {
            const handleSetCookie = async () => {
                try {
                    await mutateAsync(actionData?.authToken || "");
                    queryClient.setQueryData(['currentUser'], () => {
                        return {
                            id: actionData.user?.id || "",
                            email: actionData.user?.email || "",
                            username: actionData.user?.username || "",
                            fullName: actionData.user?.fullName || "",
                            bio: actionData.user?.bio || "",
                            profileImageURL: actionData.user?.profileImageURL || ""
                        }
                    })
                    navigate("/", { replace: true });
                } catch (error) {
                    console.error("Failed to set cookie", error);
                }
            };

            handleSetCookie();
        }
    }, [isLoginSuccessful]);


    return (
        <Form method="post" className="space-y-6 w-full max-w-sm">
            {actionData?.errors?.general && (
                <GeneralError error={actionData.errors.general} />
            )}

            <SigninForm />

            <SubmitButton isSubmitting={isSubmitting} defaultLabel="Sign in" loadingLabel="Signing in...." />

        </Form>
    );
}
