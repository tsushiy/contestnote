import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { GlobalState } from "../../types/globalState";
import {
  isAccepted,
  acceptedOrLatestSubmission,
} from "../../utils/submissionUtil";
import { aojProblemDifficultyString } from "../../utils/problemUtil";
import { timePassageString } from "../../utils/time";
import { Submission } from "../../types/submissions";
import { ProblemLink } from "../Elements/ProblemLink";
import { EditButton, ViewButton } from "../Elements/NoteLink";
import { NotesLinkButton } from "../Elements/NotesLink";

type Props = {
  problemNo: number;
};

const cellColor = (submission: Submission | null, noteExists: boolean) => {
  if (submission === null) {
    if (!noteExists) {
      return "";
    } else {
      return "tablecell-note";
    }
  }
  if (isAccepted(submission)) {
    return "tablecell-success";
  } else {
    return "tablecell-warning";
  }
};

const TableCell: React.FC<Props> = (props: Props) => {
  const { problemNo } = props;
  const { problemMap, submissionMap } = useSelector(
    (state: GlobalState) => state.problem
  );
  const { myNotesMap } = useSelector((state: GlobalState) => state.note);

  const note = myNotesMap.get(problemNo);
  const problem = problemMap.get(problemNo);

  const submissions = submissionMap.get(problemNo);
  const acceptedOrLatest = acceptedOrLatestSubmission(submissions);
  const timePassed = timePassageString(acceptedOrLatest?.date);

  return (
    <td
      className={cellColor(acceptedOrLatest, note !== undefined)}
      style={{ position: "relative" }}
    >
      <div style={{ display: "block", marginBottom: "2px" }}>
        <ButtonsWrapper>
          <EditButton problemNo={problemNo} />
          <ViewButton note={note} />
          <NotesLinkButton problemNo={problemNo} />
        </ButtonsWrapper>
      </div>
      <ProblemLinkContainer>
        <ProblemLink problem={problem} />
        {problem && problem.Domain === "aoj" && (
          <span
            className="difficulty-none"
            style={{ fontSize: "0.85em", float: "right" }}
          >
            {aojProblemDifficultyString(problem)}
          </span>
        )}
      </ProblemLinkContainer>
      {timePassed && <TimePassage>{timePassed}</TimePassage>}
    </td>
  );
};

const ProblemLinkContainer = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  padding-bottom: 6px;
`;

const ButtonsWrapper = styled.div`
  a {
    font-size: 0.8em;
    padding: 0.15em 0.4em;
    margin-right: 0.2em;
  }
`;

const TimePassage = styled.div`
  position: absolute;
  right: 2px;
  bottom: 0;
  font-size: 0.7em;
  color: #666;
`;

export default TableCell;
