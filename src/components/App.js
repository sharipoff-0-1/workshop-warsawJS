import PageContent from "./PageContent";
import NavBar from "./NavBar";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <PageContent />
      </QueryClientProvider>
    </div>
  );
}

export default App;
