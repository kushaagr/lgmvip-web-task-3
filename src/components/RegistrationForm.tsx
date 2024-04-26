'use client';
import React, { useState, useReducer, useRef } from "react";


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button as ShadButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"


import { ReloadIcon, UserIcon } from "@/components/HeroIcons";
import DynamicPillInput, { PillInterface } from "@/components/DynamicPills";

import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import { RadioGroup, Radio } from "@nextui-org/radio";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { ReloadIcon } from "@radix-ui/react-icons"
import { ChangeEvent, FormEvent } from "react";

import { cn, isEmptyOrNull } from "@/lib/utils";
import { useUploadThing } from "@/utils/uploadthing";
import { db, StudentInterface } from "@/lib/db";

type Action = {
  type: string;

  newName?: string;
  newEmail?: string;
  newWebsite?: string;
  newImage?: File;
  // newImage?: File;
  newGender?: string;
  newSkills?: PillInterface[];
};

type State = {
  name: string;
  email: string;
  website?: string;
  image?: File;
  // image?: File;
  gender: string;
  skills?: PillInterface[];
};

const initialFormState = {
  name: "",
  email: "",
  website: "",
  image: undefined,
  // image: undefined,
  gender: "",
  skills: [],
};

type ResponseReceipt = {
  // https://docs.uploadthing.com/api-reference/react
  fileKey: string;
  fileUrl: string;
  fileName: string;
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

export default function RegistrationForm(props: { className?: string }) {
  // const [gender, setGender] = useState<string>("");
  const [formState, dispatch] = useReducer(reducer, initialFormState);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const uploadButton = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "imageUploader",
    {
      onUploadBegin: () => {
        setIsProcessing(true);
        // alert("upload has begun");
      },
      onClientUploadComplete: (res) => {
        const ticket: ResponseReceipt = {
          fileUrl: res[0].url,
          fileName: res[0].name,
          fileKey: res[0].key
        }
        submitToDb(formState, ticket);
        setIsProcessing(false);
        /* Info: res.fileUrl returns undefine */
        console.log(res, res[0].url);
        // alert("uploaded successfully!");
      },
      onUploadError: () => {
        setIsProcessing(false);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        // alert("Error occurred while uploading image.");
      },
    },
  );

  const submitToDb = (formState: State, ticket?: ResponseReceipt) => {
    const data: StudentInterface = {
      name: formState.name,
      email: formState.email,
      website: formState.website ?? "",
      // image_link: "" /* Todo: useUploadThing() */,
      image_link: ticket?.fileUrl ?? "",
      image_key: ticket?.fileKey ?? "",
      image_name: ticket?.fileName ?? "",
      gender: formState.gender as "M" | "F",
      skills: formState.skills?.map((pill) => pill.text) ?? [],
    };
    db.students.add(data);
    toast({ title:"Form submitted successfully ✨" });
    console.log(data);
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (formState.image != undefined) {
      setIsProcessing(true);
      startUpload([formState.image]);
    } else {
      setIsProcessing(true);
      submitToDb(formState);
      setIsProcessing(false);
      toast({ title:"Form submitted successfully ✨" });
    }
  }

  function clearFields(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    dispatch({
      type: "field_change",
      newName: "",
      newEmail: "",
      newWebsite: "",
      newImage: undefined,
      newGender: "",
      newSkills: [],
    });
    if (uploadButton.current) uploadButton.current.value = "";
  }

  const isInvalidGender = (gender: string) => gender.trim() === "";

  return (
    <div className={cn("relative", props.className)}>
      {isProcessing === true ? (
        <Progress
          isIndeterminate
          size="sm"
          aria-label="Loading..."
          className="sticky top-0 mb-2"
        />
      ) : null}
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
          disabled={isProcessing}
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
          disabled={isProcessing}
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
          disabled={isProcessing}
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
          accept="image/*"
          // value={formState.image? o.name ?? ""}
          // value={formState.image}
          ref={uploadButton}
          disabled={isProcessing}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: "field_change",
              newImage: e.target.files ? e.target.files[0] : undefined,
            });
            // console.log(formState.image?.name ?? "<empty>");
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
            <Radio id="male" value="M" disabled={isProcessing}>
              Male
            </Radio>
          </div>
          <div className="flex flex-row items-center gap-2">
            {/* <RadioGroupItem id="female" value="F">Female</RadioGroupItem> */}
            {/* <Label htmlFor="female">Female</Label> */}
            <Radio id="female" value="F" disabled={isProcessing}>
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
          <ShadButton type="submit" className="w-40" disabled={isProcessing}>
            {isProcessing === true ? (
              <ReloadIcon className="mr-2 animate-spin" />
            ) : null}
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