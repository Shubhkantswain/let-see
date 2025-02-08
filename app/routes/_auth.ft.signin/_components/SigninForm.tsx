import { genderOptions } from "constant";
import React, { useState } from "react";
import { ActionData } from "types";
import InputField from "~/routes/_auth/Components/InputField";
import PasswordField from "~/routes/_auth/Components/PasswordField";

interface SigninFormProps {
    actionData?: ActionData
}

const SigninForm: React.FC<SigninFormProps> = ({ actionData }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <>
            <InputField
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                label="Username or Email"
                autoComplete="usernameOrEmail"
                error={actionData?.errors?.username}
            />

            <PasswordField
                error={actionData?.errors?.password}
            />
        </>
    );
};

export default SigninForm;