import { Box, Container, Heading } from "@chakra-ui/react";
import { generateMockMatches } from "./services/mockData";

function App() {
  const matches = generateMockMatches(10000);

  console.log("Generated matches:", matches.length);
  console.log("Example match:", matches[0]);
  console.log("Another example:", matches[1]);

  return (
    <Container maxW="100vw" p={0}>
      <Box bg="gray.900" color="white" minH="100vh">
        <Box p={4} bg="gray.800" borderBottom="1px" borderColor="gray.700">
          <Heading size="lg" color="blue.400">
            🎯 Live Odds Board
          </Heading>
        </Box>
        <Box p={4}>
          <Heading size="md">Coming soon...</Heading>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
