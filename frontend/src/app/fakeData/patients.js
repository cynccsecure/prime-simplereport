// dummy responses for async queries
export const demoPatients = [
  {
    patientId: "$PATIENT-b3xkhkyxb70",
    lookupId: "patientId1",
    firstName: "Edward",
    middleName: "D",
    lastName: "Teach",
    birthDate: "01/01/1717",
    address: "123 Plank St, Nassau",
    phone: "(123) 456-7890",
  },
  {
    patientId: "$PATIENT-3xpkhkyx51m",
    lookupId: "patientId2",
    firstName: "James",
    middleName: "D.",
    lastName: "Flint",
    birthDate: "01/01/1719",
    address: "456 Plank St, Nassau",
    phone: "(321) 546-7890",
  },
  {
    patientId: "$PATIENT-2ockhkyx15k",
    lookupId: "patientId3",
    firstName: "John",
    middleName: "'Long'",
    lastName: "Silver",
    birthDate: "01/01/1722",
    address: "789 Plank St, Nassau",
    phone: "(213) 645-7890",
  },
  {
    patientId: "$PATIENT-mh5khkzccs0",
    lookupId: "patientId4",
    firstName: "Sally",
    middleName: "Mae",
    lastName: "Map",
    birthDate: "01/01/1922",
    address: "789 Road St, Nassau",
    phone: "(243) 635-7190",
  },
];

// dummy initial data to populate redux
export const initialPatientState = {
  patientId1: {
    patientId: "$PATIENT-b3xkhkyxb70",
    lookupId: "patientId1",
    firstName: "Edward",
    middleName: "I",
    lastName: "Teach",
    birthDate: "01/01/1717",
    address: "123 Plank St, Nassau",
    phone: "(123) 456-7890",
  },
  patientId2: {
    patientId: "$PATIENT-3xpkhkyx51m",
    lookupId: "patientId2",
    firstName: "James",
    middleName: "D.",
    lastName: "Flint",
    birthDate: "01/01/1719",
    address: "456 Plank St, Nassau",
    phone: "(321) 546-7890",
  },
  patientId3: {
    patientId: "$PATIENT-2ockhkyx15k",
    lookupId: "patientId3",
    firstName: "John",
    middleName: "'Long'",
    lastName: "Silver",
    birthDate: "01/01/1722",
    address: "789 Plank St, Nassau",
    phone: "(213) 645-7890",
  },
  patientId4: {
    patientId: "$PATIENT-mh5khkzccs0",
    lookupId: "patientId4",
    firstName: "Sally",
    middleName: "Mae",
    lastName: "Map",
    birthDate: "01/01/1922",
    address: "789 Road St, Nassau",
    phone: "(243) 635-7190",
  },
};
