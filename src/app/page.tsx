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
import DynamicPillInput from "@/components/DynamicPills";
import { cn } from "@/lib/utils";
import { FormEvent } from "react";
import { useState, useReducer } from "react";

function RegistrationForm(props: { className?: string }) {
  const [gender, setGender] = useState<string>("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(`Form submitted:`, e);
  }

  const isInvalidGender = gender.trim() === "";

  return (
    <div className={cn("p-5", props.className)}>
      <form
        onSubmit={handleSubmit}
        className="grid auto-cols-max grid-cols-2 gap-3"
      >
        <Label htmlFor="name" className="">
          Name<sup>*</sup>
        </Label>
        <Input
          id="name"
          required
          placeholder="Name"
          className="block max-w-80"
        />

        <Label htmlFor="email" className="">
          Email<sup>*</sup>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          required
          className="max-w-80"
        />

        <Label htmlFor="website" className="">
          Website
        </Label>
        <Input id="website" placeholder="Website link" className="max-w-80" />

        <Label htmlFor="profileImage" className="">
          Upload your image
        </Label>
        <Input id="profileImage" type="file" className="max-w-80" />

        <Label htmlFor="gender" className="">
          Gender<sup>*</sup>
        </Label>
        <RadioGroup
          id="gender"
          value={gender}
          isInvalid={isInvalidGender}
          onValueChange={setGender}
          orientation="horizontal"
          className="col-start-2 flex flex-col gap-5"
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
          className="rounded-sm border border-gray-400"
        />

        {/* <Input type="submit" className="max-w-80" /> */}
        <div className="col-span-2 mt-5 flex flex-row justify-between gap-2">
          <ShadButton type="submit" className="w-40">
            Submit
          </ShadButton>
          <Button className="w-32">Clear</Button>
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
