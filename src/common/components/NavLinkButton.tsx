import React from "react";
import { Link } from "../types/link";
import { Button } from "./elements/Button";

type Props = {
  headerLinks: Link[];
  initialLinks: Link[];
} & Link;

const NavLinkButton: React.FC<Props> = ({
  name,
  href,
  isNew,
  headerLinks,
  initialLinks,
}) => {
  const headerLinksName = headerLinks.map((link) => link.name);
  const isPresentInHeader = headerLinksName.includes(name);

  return (
    <div className="relative flex items-center">
      <Button
        colorScheme={isPresentInHeader ? "red" : "gray"}
        className="w-full !text-lg"
        onClick={async () => {
          if (!isPresentInHeader) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id!, {
                from: "app.js",
                query: "add_new_link",
                link: JSON.stringify({
                  name,
                  href,
                  isNew,
                }),
              });
            });

            return;
          }

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, {
              from: "app.js",
              query: "remove_link_from_links",
              linkName: name,
            });
          });
        }}
      >
        {name}
      </Button>

      {isNew && (
        <img
          src="/delete.svg"
          className="cursor-pointer absolute p-1 -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full"
          onClick={async () => {
            let newInitialLinks = initialLinks.filter((e) => e.name !== name);

            await chrome.storage.sync.set({
              initial_links: JSON.stringify(newInitialLinks),
            });
          }}
        />
      )}
    </div>
  );
};

export default NavLinkButton;
