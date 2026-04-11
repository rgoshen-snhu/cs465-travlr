export interface Trip {
    _id: string; // Internal primary key in MongoDB
    code: string; // Unique code for the trip
    name: string;
    length: string;
    start: Date;
    resort: string;
    perPerson: string;
    image: string;
    description: string;
}