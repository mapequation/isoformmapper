import {
  Box,
  Button,
  Field,
  Flex,
  Spacer,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

interface Props extends TextareaProps {
  isoID: number;
  onLoadContent: (content: string) => void;
  onChangeContent?: (content: string) => void;
  value?: string;
  error?: string;
}
export default function InputTextArea(props: Props) {
  const [_content, setContent] = useState(props.value ?? "");
  const { isoID, onLoadContent, onChangeContent, value, error, ...rest } =
    props;

  const content = value ?? _content;

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChangeContent) {
      onChangeContent(event.target.value);
    } else {
      setContent(event.target.value);
    }
  };

  const onClickLoad = () => {
    onLoadContent(content);
    if (onChangeContent === undefined) {
      setContent("");
    }
  };
  const isError = !!error;

  return (
    <Box display="flex" flexDir="column">
      <Field.Root invalid={isError}>
        <Textarea
          resize="none"
          size="sm"
          {...rest}
          value={content}
          onChange={onChange}
        />
        <Field.ErrorText>Error: {error}</Field.ErrorText>
      </Field.Root>
      <Flex mt={2}>
        <Spacer />
        <Button
          variant="outline"
          size="sm"
          disabled={content === ""}
          onClick={onClickLoad}
        >
          Load
        </Button>
      </Flex>
    </Box>
  );
}
