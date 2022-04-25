import React, { useState } from "react";
import { Input, Box, Flex } from "@chakra-ui/react"

const DynamicText = React.forwardRef((props, ref) => {
  
  const [value, setValue] = useState("Random Text");

  React.useImperativeHandle(ref, () => ({
    changeValue(newValue) {
      setValue(newValue);
    }
  }))
  
  return <Box
    textStyle="h1"
    p={2}
    maxW={{base:"18em",  sm:"28em", md:"48em", lg:"62em", xl:"80em"}}
  >
    {value}
  </Box>;
});

export default DynamicText;
