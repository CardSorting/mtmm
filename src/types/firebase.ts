import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

export type FirebaseUser = User;

export type FirebaseDocument = DocumentData;

export type FirebaseCollection<T extends FirebaseDocument> = {
  id: string;
  data: T;
};

export type FirebaseError = {
  code: string;
  message: string;
  name: string;
};

export type FirebaseAuthError = FirebaseError & {
  email?: string;
  credential?: any;
};

export type FirebaseQuery = {
  field: string;
  operator: FirebaseQueryOperator;
  value: any;
};

export type FirebaseQueryOperator =
  | "<"
  | "<="
  | "=="
  | "!="
  | ">="
  | ">"
  | "array-contains"
  | "array-contains-any"
  | "in"
  | "not-in";