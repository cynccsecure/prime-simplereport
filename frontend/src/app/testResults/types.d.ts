type MultiplexDisease =
  | MULTIPLEX_DISEASES.COVID_19
  | MULTIPLEX_DISEASES.FLU_A
  | MULTIPLEX_DISEASES.FLU_B;
type TestResult =
  | TEST_RESULTS.POSITIVE
  | TEST_RESULTS.NEGATIVE
  | TEST_RESULTS.UNDETERMINED
  | TEST_RESULTS.UNKNOWN;

interface DiseaseName {
  disease: {
    name: MultiplexDisease;
  };
}

interface MultiplexResult extends DiseaseName {
  testResult: TestResult;
}

type MultiplexResults = MultiplexResult[];

// Represents a single test result with context from parent test event
type EnrichedMultiplexResult = TestResult & MultiplexResult;

type FilterParams = {
  patientId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  disease?: string | null;
  role?: string | null;
  result?: string | null;
  filterFacilityId?: string | null;
};
