"use client";

import Image from "next/image";

import { useLiveQuery } from "dexie-react-hooks";
import { db, StudentInterface } from "@/lib/db";

import RegistrationForm from "@/components/RegistrationForm";

import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { uploadFiles } from "@/utils/uploadthing";

import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import { User } from "@nextui-org/user";
// import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { Link } from "@nextui-org/link";

import { DeleteIcon } from "@/components/DeleteIcon";

import { columns, users } from "@/lib/data";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
  M: "primary",
  F: "secondary",
};

// type User = (typeof users)[0];

interface Column {
  name: string;
  uid: string;
}
const mycolumns: Column[] = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "SEX", uid: "gender" },
  { name: "SKILLS", uid: "skills" },
  { name: "ACTIONS", uid: "actions" },
];

// name: string;
// email: string;
// website?: string;
// image_link?: string;
// image_key?: string;
// image_name?: string;
// gender: 'M' | 'F' | 'Other';
// skills: string[];

function EnrolledStudentsList(props: { className?: string }) {
  const students = useLiveQuery(() => db.students.toArray());
  // const students = await db.students.toArray();
  // console.log(students);

  function handleDelete(
    e: React.MouseEvent<HTMLButtonElement>,
    id: number | string,
    student: StudentInterface,
  ) {
    console.log(`Deleting id: ${id}`);
    db.students.delete(id).then(() => {
      console.log("Successfully deleted record:", id);
      if (!student.image_link) 
        return;
      const fileDeleted = new File([], `Delete_${student.image_link}`);
      uploadFiles("imageUploader", { files: [fileDeleted] }).then((value) =>
        console.log(
          "Successfully put hint to delete file on cloud. Server returned:",
          value,
        ),
      );
    });
  }

  // const renderCell = useCallback((user: User, columnKey: React.Key) => {
  const renderCell = useCallback(
    (student: StudentInterface, columnKey: React.Key) => {
      const cellValue = student[columnKey as keyof StudentInterface];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-row gap-2">
              <Avatar>
                <AvatarImage src={student.image_link} alt={student.name} />
                <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {cellValue}
                <Link href={student.website} size="sm">
                  <span className="max-w-36 overflow-hidden text-ellipsis text-wrap text-sm text-blue-500">
                    {student.website}
                  </span>
                </Link>
              </div>
            </div>
          );
        case "email":
          return (
            <div className="max-w-fit overflow-hidden text-wrap break-words lg:max-w-40">
              {cellValue}
            </div>
          );
        case "sex":
          return <Badge variant="destructive">{cellValue}</Badge>;
        case "skills":
          return (
            <div className="">
              {cellValue && Array.isArray(cellValue)
                ? cellValue.map((item) => (
                    <Badge className="mr-1">{item}</Badge>
                  ))
                : []}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="danger" content="Delete user">
                <span className="cursor-pointer text-lg text-danger active:opacity-50">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <DeleteIcon />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleDelete(e, student.id, student)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => handleDelete(e, student.id, student)}
                  >
                    <DeleteIcon />
                  </Button> */}
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className={cn("", props.className)}>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={mycolumns}>
          {mycolumns.map((column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody items={students}>
          {students?.map((item) => (
            <TableRow key={item.id}>
              {mycolumns.map((column) => (
                <TableCell key={column.uid}>
                  {renderCell(item, column.uid)}
                </TableCell>
              ))}
            </TableRow>
          )) ?? []}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex-row flex-nowrap items-center lg:flex">
      <Toaster />
      <Tabs defaultValue="form" className="w-full p-5 lg:hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Registration</TabsTrigger>
          <TabsTrigger value="list">Enrolled Students</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <RegistrationForm className="w-full p-5" />
        </TabsContent>
        <TabsContent value="list">
          <EnrolledStudentsList className="block w-full max-w-full p-5" />
        </TabsContent>
      </Tabs>

      <RegistrationForm className="hidden w-full p-5 lg:block lg:max-w-[40%]" />
      <Separator orientation="vertical" className="hidden h-96 w-1 lg:block" />
      {/* <Separator
        orientation="horizontal"
        className="mx-auto block h-1 w-[80vw] lg:hidden"
      /> */}
      <EnrolledStudentsList className="hidden w-full p-5 lg:block lg:max-w-[60%]" />
    </main>
  );
}
