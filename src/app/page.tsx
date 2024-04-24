"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { Button as ShadButton } from "@/components/ui/button";
import { Progress } from "@nextui-org/progress";
import DynamicPillInput, { PillInterface } from "@/components/DynamicPills";
import { cn } from "@/lib/utils";
import { ChangeEvent, FormEvent } from "react";
import React, { useState, useReducer } from "react";

type Action = {
  type: string;

  newName?: string;
  newEmail?: string;
  newWebsite?: string;
  newImage?: string;
  // newImage?: File;
  newGender?: string;
  newSkills?: PillInterface[];
};

type State = {
  name: string;
  email: string;
  website?: string;
  image?: string;
  // image?: File;
  gender: string;
  skills?: PillInterface[];
};

const initialFormState = {
  name: "",
  email: "",
  website: "",
  image: "",
  // image: undefined,
  gender: "",
  skills: [],
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "field_change": {
      return {
        name: action.newName ?? state.name,
        email: action.newEmail ?? state.email,
        website: action.newWebsite ?? state.website,
        image: action.newImage ?? state.image,
        gender: action.newGender ?? state.gender,
        skills: action.newSkills ?? state.skills,
      };
    }
    default: {
      // throw Error('Unknown action:', action.type);
      return state;
    }
  }
}

function RegistrationForm(props: { className?: string }) {
  // const [gender, setGender] = useState<string>("");
  const [formState, dispatch] = useReducer(reducer, initialFormState);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData();
    
    form.append('param-one', 'value-one');
    form.append('name', formState.name);
    form.append('email', formState.email);
    form.append('website', formState.website ?? '');
    form.append('image', formState.image ?? '');
    form.append('gender', formState.gender);
    form.append('skills', JSON.stringify(formState.skills));

    console.log(`Form created:`, JSON.stringify(Array.from(form.entries())));
    // console.log(formState.name, formState.gender, formState.image);
    // console.log(`Form submitted:`, e);
  }

  function clearFields(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    dispatch({
      type: "field_change",
      newName: "",
      newEmail: "",
      newWebsite: "",
      newImage: "",
      newGender: "",
      newSkills: [],
    });
  }

  const isInvalidGender = (gender: string) => gender.trim() === "";

  return (
    <div className={cn("p-5", props.className)}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:grid md:grid-cols-2"
      >
        <Label htmlFor="name" className="">
          Name<sup>*</sup>
        </Label>
        <Input
          id="name"
          placeholder="Name"
          value={formState.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "field_change",
              newName: e.target.value,
            });
          }}
          required
          className="mb-3 block w-full md:max-w-80"
        />

        <Label htmlFor="email" className="">
          Email<sup>*</sup>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={formState.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "field_change",
              newEmail: e.target.value,
            });
          }}
          required
          className="mb-3 w-full md:max-w-80"
        />

        <Label htmlFor="website" className="">
          Website
        </Label>
        <Input
          id="website"
          placeholder="Website link"
          value={formState.website}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "field_change",
              newWebsite: e.target.value,
            });
          }}
          className="mb-3 w-full md:max-w-80"
        />

        <Label htmlFor="profileImage" className="">
          Upload your image
        </Label>
        <Input
          id="profileImage"
          type="file"
          value={formState.image}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "field_change",
              newImage: e.target.value,
            });
          }}
          // onChange={(e) => {console.log(e.target.value, e.target.files)}}
          className="mb-3 w-full md:max-w-80"
        />

        <Label htmlFor="gender" className="">
          Gender<sup>*</sup>
        </Label>
        <RadioGroup
          id="gender"
          // value={gender}
          value={formState.gender}
          isInvalid={isInvalidGender(formState.gender)}
          // onValueChange={setGender}
          onValueChange={(value) =>
            dispatch({
              type: "field_change",
              newGender: value,
            })
          }
          orientation="horizontal"
          className="col-start-2 mb-3 flex flex-col gap-5"
        >
          <div className="flex flex-row items-center gap-2">
            {/* <RadioGroupItem id="male" value="M">Male</RadioGroupItem> */}
            {/* <Label htmlFor="male">Male</Label> */}
            <Radio id="male" value="M">
              Male
            </Radio>
          </div>
          <div className="flex flex-row items-center gap-2">
            {/* <RadioGroupItem id="female" value="F">Female</RadioGroupItem> */}
            {/* <Label htmlFor="female">Female</Label> */}
            <Radio id="female" value="F">
              Female
            </Radio>
          </div>
        </RadioGroup>

        <Label htmlFor="skills" className="">
          Skills
        </Label>
        <DynamicPillInput
          inputId="skills"
          className="mb-3 rounded-sm border border-gray-400"
          value={formState.skills}          
          // setParentState={(value) => {
          //   dispatch({
          //     type: "field_change",
          //     newSkills: value,
          //   });
          // }}
          setValue={(value) => {
            dispatch({
              type: "field_change",
              newSkills: value,
            });
          }}
        />

        {/* <Input type="submit" className="max-w-80" /> */}
        <div className="col-span-2 mt-5 flex flex-row justify-between gap-2">
          <ShadButton type="submit" className="w-40">
            Submit
          </ShadButton>
          <Button onClick={clearFields} className="w-32 rounded-md">
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

function EnrolledStudentsList(props: { className?: string }) {
  return <div className={cn("", props.className)}>List View</div>;
}

export default function Home() {
  return (
    <main className="min-h-screen flex-row flex-nowrap items-center md:flex">
      <RegistrationForm className="w-full md:max-w-[50%]" />
      <Separator
        orientation="vertical"
        className="hidden h-96 w-1 bg-emerald-200 md:block"
      />
      <EnrolledStudentsList className="w-full md:max-w-[50%]" />
    </main>
  );
}
