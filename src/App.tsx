import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "./App.css";
import NavLinkButton from "./common/components/NavLinkButton";
import PageLayout from "./common/layout/PageLayout";
import { Link } from "./common/types/link";
import StickyHeader from "./modules/StickyHeader";
import { initialValues } from "./utils/constants";

function App() {
  // const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [initialLinks, setInitialLinks] = useState<Link[]>([]);
  const [headerLinks, setHeaderLinks] = useState<Link[]>([]);

  async function initializer() {
    const response = await chrome.storage.sync.get([
      "github_username",
      "initial_links",
    ]);

    // setUsername(response.github_username);

    let _initialLinks = response?.initial_links
      ? JSON.parse(response.initial_links)
      : [];

    setInitialLinks(_initialLinks as Link[]);

    let _headerLinks = await chrome.storage.sync.get(["links"]);
    _headerLinks = _headerLinks?.links ? JSON.parse(_headerLinks.links) : [];

    setHeaderLinks(_headerLinks as Link[]);

    setIsLoading(false);
  }

  async function setInitialLinksValue() {
    let storage = await chrome.storage.sync.get(["initial_links"]);
    let _initialLinks = storage?.initial_links;

    if (!_initialLinks) {
      await chrome.storage.sync.set({
        initial_links: JSON.stringify(Object.values(initialValues)),
      });
    }
  }

  useEffect(() => {
    setInitialLinksValue();
    const interval = setInterval(initializer, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <PageLayout className="flex flex-col gap-2">
      <StickyHeader />

      <div className="grid gap-4 p-4 !pt-0">
        <h2 className="!font-bold">Add Links to the GitHub Navbar</h2>

        {isLoading ? (
          <div className="grid place-content-center">
            <RotatingLines width="40" visible={true} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {initialLinks.map((link) => (
              <NavLinkButton
                key={link.name}
                {...link}
                {...{ headerLinks, initialLinks }}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default App;
