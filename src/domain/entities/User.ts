export class User {
  private _id: string;
  private _email: string;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string, 
    email: string, 
    name: string, 
    createdAt: Date = new Date(), 
    updatedAt: Date = new Date()
  ) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
    this._updatedAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this._updatedAt = new Date();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this._email = email;
    this._updatedAt = new Date();
  }

  toObject() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 