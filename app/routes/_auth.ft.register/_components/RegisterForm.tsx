import { genderOptions } from "constant";
import React, { useState } from "react";
import { ActionData } from "types";
import InputField from "~/routes/_auth/Components/InputField";
import SelectField from "./SelectField";
import PasswordField from "~/routes/_auth/Components/PasswordField";


interface RegisterFormProps {
  actionData?: ActionData
}

const RegisterForm: React.FC<RegisterFormProps> = ({ actionData }) => {
  return (
    <>
      <InputField
        id="username"
        name="username"
        type="text"
        label="Username"
        autoComplete="username"
        error={actionData?.errors?.username}
      />

      <InputField
        id="fullName"
        name="fullName"
        type="text"
        label="Full Name"
        autoComplete="name"
        error={actionData?.errors?.fullName}
      />

      <InputField
        id="email"
        name="email"
        type="email"
        label="Email address"
        autoComplete="email"
        error={actionData?.errors?.email}
      />

      <SelectField
        id="gender"
        name="gender"
        label="Gender"
        options={genderOptions}
        error={actionData?.errors?.gender}
      />

      <PasswordField
        error={actionData?.errors?.password}
      />
    </>
  );
};

export default RegisterForm;
