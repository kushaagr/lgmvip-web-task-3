"use client";

import Image from "next/image";

import { useLiveQuery } from 'dexie-react-hooks';
import { db, StudentInterface } from "@/lib/db";

import RegistrationForm from "@/components/RegistrationForm";

import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

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
import { Chip, ChipProps } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";

import { DeleteIcon } from "@/components/DeleteIcon";

import { columns, users } from "@/lib/data";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
  M: "primary",
  F: "secondary"
};

type User = (typeof users)[0];

interface Column {
  name: string;
  uid: string;
}
const mycolumns: Column[] = [
  { name: "NAME", uid: "name" },
  { name: "WEBSITE", uid: "website" },  
  { name: "SEX", uid: "sex"},
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
  console.log(students);

  // const renderCell = useCallback((user: User, columnKey: React.Key) => {
  const renderCell = useCallback((student: StudentInterface, columnKey: React.Key) => {
    const cellValue = student[columnKey as keyof StudentInterface];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: student.image_link }}
            description={student.email}
            name={cellValue}
          >
            {student.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {student.website}
            </p>
          </div>
        );
      case "sex":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[student.gender]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "skills":
        return (
          <Chip
            className="capitalize"
            color="default"
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="danger" content="Delete user">
              <span className="cursor-pointer text-lg text-danger active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className={cn("", props.className)}>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={mycolumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={students}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex-row flex-nowrap items-center lg:flex">
      <Toaster />
      <RegistrationForm className="w-full p-5 lg:max-w-[50%]" />
      <Separator
        orientation="vertical"
        className="hidden h-96 w-1 bg-emerald-200 lg:block"
      />
      <Separator
        orientation="horizontal"
        className="mx-auto block h-1 w-[80vw] lg:hidden"
      />
      <EnrolledStudentsList className="w-full p-5 lg:max-w-[50%]" />
    </main>
  );
}
