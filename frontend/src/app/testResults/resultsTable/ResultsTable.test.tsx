import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PATIENT_TERM_CAP } from "../../../config/constants";
import TEST_RESULTS_MULTIPLEX from "../mocks/resultsMultiplex.mock";
import TEST_RESULT_COVID from "../mocks/resultsCovid.mock";
import { TestResult } from "../../../generated/graphql";
import { toLowerCaseHyphenate } from "../../utils/text";

import ResultsTable, { generateTableHeaders } from "./ResultsTable";

const TEST_RESULTS_MULTIPLEX_CONTENT =
  TEST_RESULTS_MULTIPLEX.content as TestResult[];
describe("Method generateTableHeaders", () => {
  const table = (headers: JSX.Element) => (
    <table>
      <thead>{headers}</thead>
    </table>
  );
  it("checks basic headers", () => {
    render(table(generateTableHeaders(false)));
    expect(
      screen.getByRole("columnheader", {
        name: new RegExp(`${PATIENT_TERM_CAP}`, "i"),
      })
    );
    expect(
      screen.getByRole("columnheader", { name: /Test date/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Condition/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Result/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Test device/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Actions/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /facility b/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /submitted by/i })
    ).toBeInTheDocument();
  });

  it("checks facility header", () => {
    render(table(generateTableHeaders(true)));
    expect(
      screen.getByRole("columnheader", { name: /facility/i })
    ).toBeInTheDocument();
  });

  it("checks submitted by header hides", () => {
    render(table(generateTableHeaders(true)));
    expect(
      screen.queryByRole("columnheader", {
        name: /Submitted by/i,
      })
    ).not.toBeInTheDocument();
  });
});

describe("Component ResultsTable", () => {
  const setPrintModalIdFn = jest.fn();
  const setMarkCorrectionIdFn = jest.fn();
  const setDetailsModalIdFn = jest.fn();
  const setTextModalIdFn = jest.fn();
  const setEmailModalTestResultIdFn = jest.fn();

  it("checks table without results", () => {
    render(
      <ResultsTable
        results={[]}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={false}
        hasFacility={false}
      />
    );

    expect(
      screen.getByRole("cell", { name: /no results/i })
    ).toBeInTheDocument();
  });

  it("checks table with covid results", () => {
    render(
      <ResultsTable
        results={[TEST_RESULT_COVID.content[0]] as TestResult[]}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={false}
        hasFacility={false}
      />
    );

    expect(screen.getByTestId("covid-19-result")).toHaveTextContent("Negative");
    expect(screen.queryByText("Flu A")).not.toBeInTheDocument();
    expect(screen.queryByText("Flu B")).not.toBeInTheDocument();
  });

  it("checks table with multiplex results", () => {
    render(
      <ResultsTable
        results={TEST_RESULTS_MULTIPLEX_CONTENT}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={true}
        hasFacility={false}
      />
    );

    // 5 rows -> 9 rows

    for (const result of TEST_RESULTS_MULTIPLEX_CONTENT) {
      const resultId = result.internalId;

      for (const multiplexResult of result.results as MultiplexResults) {
        const testId = `test-result-${resultId}-${toLowerCaseHyphenate(
          multiplexResult.disease.name
        )}`;
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      }
    }

    // TODO: all expected elements are present, but is it exhaustive?
    // Test to check the # of rows
    expect(screen.getByTestId("filtered-results").children.length).toBe(9);
  });

  it("renders multiplex results in correct order", () => {
    render(
      <ResultsTable
        results={TEST_RESULTS_MULTIPLEX_CONTENT}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={true}
        hasFacility={false}
      />
    );

    const multiplexResultsForTest =
      screen.getByTestId("filtered-results").children;

    // Get all results for most recent multiplex test
    const covidResult = multiplexResultsForTest.item(6);
    const fluAResult = multiplexResultsForTest.item(7);
    const fluBResult = multiplexResultsForTest.item(8);

    expect(covidResult).toHaveTextContent("COVID-19");
    expect(fluAResult).toHaveTextContent("Flu A");
    expect(fluBResult).toHaveTextContent("Flu B");
  });

  it("renders multiple results for the same patient with different aria labels", () => {
    render(
      <ResultsTable
        results={TEST_RESULTS_MULTIPLEX_CONTENT}
        setPrintModalId={setPrintModalIdFn}
        setMarkCorrectionId={setMarkCorrectionIdFn}
        setDetailsModalId={setDetailsModalIdFn}
        setTextModalId={setTextModalIdFn}
        setEmailModalTestResultId={setEmailModalTestResultIdFn}
        hasMultiplexResults={true}
        hasFacility={false}
      />
    );

    const userResults = screen.getAllByText(
      "Purrington, Rupert G"
    ) as HTMLButtonElement[];

    const userAriaLabels = userResults.map((r) => r.getAttribute("aria-label"));
    expect(new Set(userAriaLabels).size).toBe(userResults.length);
  });

  describe("actions menu", () => {
    describe("text result action", () => {
      it("includes `Text result` if patient has mobile number", async () => {
        const testResultPatientMobileNumber = [
          TEST_RESULTS_MULTIPLEX_CONTENT[1],
        ];

        render(
          <ResultsTable
            results={testResultPatientMobileNumber}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        await act(async () => await userEvent.click(moreActions));

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.getByText("Text result")).toBeInTheDocument();
      });

      it("does not include `Text result` if no patient mobile number", async () => {
        const testResultPatientNoMobileNumber = [
          TEST_RESULTS_MULTIPLEX_CONTENT[0],
        ];

        render(
          <ResultsTable
            results={testResultPatientNoMobileNumber}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        await act(async () => await userEvent.click(moreActions));

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.queryByText("Text result")).not.toBeInTheDocument();
      });
    });
    describe("email result action", () => {
      it("includes `Email result` if patient email address", async () => {
        const testResultPatientEmail: TestResult[] = [
          TEST_RESULTS_MULTIPLEX_CONTENT[0],
        ];

        render(
          <ResultsTable
            results={testResultPatientEmail}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        await act(async () => await userEvent.click(moreActions));

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.getByText("Email result")).toBeInTheDocument();
      });

      it("does not include `Email result` if no patient email address", async () => {
        const testResultPatientNoEmail = [TEST_RESULTS_MULTIPLEX_CONTENT[1]];

        render(
          <ResultsTable
            results={testResultPatientNoEmail}
            setPrintModalId={setPrintModalIdFn}
            setMarkCorrectionId={setMarkCorrectionIdFn}
            setDetailsModalId={setDetailsModalIdFn}
            setTextModalId={setTextModalIdFn}
            setEmailModalTestResultId={setEmailModalTestResultIdFn}
            hasMultiplexResults={false}
            hasFacility={false}
          />
        );

        const moreActions = within(screen.getByRole("table")).getAllByRole(
          "button"
        )[1];

        await act(async () => await userEvent.click(moreActions));

        // Action menu is open
        expect(screen.getByText("Print result")).toBeInTheDocument();
        expect(screen.queryByText("Email result")).not.toBeInTheDocument();
      });
    });
  });
});
