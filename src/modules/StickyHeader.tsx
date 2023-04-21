import clsx from "clsx";
import React, { useState } from "react";
import { Button } from "../common/components/elements/Button";
import { Input } from "../common/components/elements/Input";
import { Link } from "../common/types/link";

const StickyHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState<Link>({
    name: "",
    href: "",
    isNew: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newLink.name || !newLink.href) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        from: "app.js",
        query: "add_new_link_to_initial",
        link: JSON.stringify(newLink),
      });
    });

    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="p-2 z-50 sticky w-full top-0 grid grid-cols-3 gap-2 bg-white">
        <Button
          colorScheme="green"
          onClick={() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id!, {
                from: "app.js",
                query: "load_preset",
              });
            });
          }}
        >
          Preset
        </Button>

        <Button
          colorScheme={isModalOpen ? "red" : "gray"}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {isModalOpen ? "Close" : "Custom Link"}
        </Button>

        <Button
          colorScheme="red"
          onClick={() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id!, {
                from: "app.js",
                query: "clear_current_profile",
              });
            });
          }}
        >
          Clear
        </Button>
      </div>

      <div
        className={clsx(
          "z-40 fixed duration-300 transition-all w-full",
          isModalOpen ? "h-full top-12 p-2" : "-top-40 h-0 overflow-hidden"
        )}
      >
        <form
          onSubmit={handleSubmit}
          className="mt-2 relative bg-blue-100 p-2 rounded-md flex flex-col items-start gap-4"
        >
          <Input
            label="Name"
            placeholder="Profile"
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
          />
          <Input
            label="Link"
            placeholder="/{username}?tab=repositories"
            onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
          />

          <Button colorScheme="green" type="submit">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StickyHeader;
