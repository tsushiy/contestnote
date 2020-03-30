import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom'
import styled from "styled-components";
import { Button } from 'react-bootstrap';
import { getMyNote, postMyNote } from '../../utils/apiClient';
import { AppState } from '../../types/appState';
import { isPublicNote } from '../../types/apiResponse';
import { changeShowPreview } from '../../reducers/editorReducer';
import { setMyNote } from '../../reducers/noteReducer';
import MarkdownEditor from './MarkdownEditor';
import EditorPreview from './EditorPreview';
import EditorFooter from './EditorFooter';

type Props = {} & RouteComponentProps<{problemNo: string}>;

const Editor: React.FC<Props> = props => {
  const problemNo = Number(props.match.params.problemNo);

  const dispatch = useDispatch();
  const [isFetchTried, setIsFetchTried] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");

  const { showPreview } = useSelector((state: AppState) => state.editor)
  const { isLoggedIn } = useSelector((state: AppState) => state.auth);
  const { problemMap } = useSelector((state: AppState) => state.problem);

  useEffect(() => {
    if (isFetchTried || !isLoggedIn) return;
    setIsFetchTried(true);
    (async() => {
      const note = await getMyNote(problemNo);
      if (note !== undefined && note.ID !== "") {
        dispatch(setMyNote({problemNo, newNote: note}));
        setRawText(note.Text);
        setIsPublic(isPublicNote(note));
      }
    })();
  }, [dispatch, isFetchTried, isLoggedIn, problemNo])

  const onSubmitText = async () => {
    try {
      const res = await postMyNote(problemNo, rawText, isPublic);
      if (res.status === 200) {
        setMessage("Successfully submitted.");
      } else {
        setMessage("Failed to submit.");
      }
    } catch (error) {
      setMessage("Failed to submit.");
    }
    setIsFetchTried(false);
  }

  const onChangeText = (txt: string) => {
    setRawText(txt)
  }

  const onChangePublic = (pub: boolean) => {
    setIsPublic(pub)
  }

  const onClickPreview = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      ev.preventDefault();
      dispatch(changeShowPreview(!showPreview));
    },
    [dispatch, showPreview]
  );

  return (
    <Container>
      <EditorHeaderContainer>
        <h5>{problemMap.get(problemNo)?.Title}</h5>
        <Button onClick={onClickPreview}>Preview</Button>
      </EditorHeaderContainer>
      <MarkdownEditorContainer>
        <MarkdownEditor showPreview={showPreview} rawText={rawText} onChangeText={onChangeText}/>
      </MarkdownEditorContainer>
      {showPreview &&
        <EditorPreviewContainer>
          <EditorPreview rawText={rawText} setMessage={setMessage}/>
        </EditorPreviewContainer>
      }
      <FooterContainer>
        <EditorFooter onSubmitText={onSubmitText} onChangePublic={onChangePublic} isPublic={isPublic} message={message}/>
      </FooterContainer>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  height: calc(100vh - 56px);
  top: 56px;
  right: 5px;
  left: 5px;
  bottom: 0;
`;

const EditorHeaderContainer = styled.div`
  position: absolute;
  height: 80px;
  padding-left: 20px;
`;

const MarkdownEditorContainer = styled.div`
  position: absolute;
  overflow: auto;
  width: calc(100vw - 10px);
  top: 80px;
  bottom: 42px;
  left: 0;
  border: solid thin #CCC;
`;

const EditorPreviewContainer = styled.div`
  position: absolute;
  overflow: auto;
  width: 50%;
  top: 80px;
  bottom: 42px;
  right: 0;
  border: solid thin #CCC;
`;

const FooterContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 42px;
  padding: 10px;
  top: auto;
  bottom: 8px;
`;

export default Editor;