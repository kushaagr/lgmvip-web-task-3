import Dexie, { Table } from 'dexie';

export interface Student {
  id?: number;
  name: string;
  email: string;
  website?: string;
  image_link?: string;
  gender: 'M' | 'F' | 'Other';
  skills: string[];
}

export class MySubClassedDexie extends Dexie {
  // 'students' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  students!: Table<Student>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      students: '++id, name, age' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();